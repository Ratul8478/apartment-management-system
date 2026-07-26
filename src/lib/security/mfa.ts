import crypto from 'crypto';

/**
 * Standard TOTP (RFC 6238) implementation using Node.js crypto module
 */

// Base32 decoding helper
function base32Decode(encoded: string): Buffer {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  const clean = encoded.replace(/=+$/, '').toUpperCase();
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = alphabet.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

// Base32 encoding helper
function base32Encode(buffer: Buffer): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31];
  }

  return output;
}

export const mfa = {
  /**
   * Generates a 20-byte random secret encoded in Base32.
   */
  generateSecret(): string {
    const randomBytes = crypto.randomBytes(20);
    return base32Encode(randomBytes);
  },

  /**
   * Generates keyuri for TOTP authenticator apps.
   */
  generateOtpAuthUrl(secret: string, email: string, issuer: string = 'FinTrack Pro'): string {
    const encodedIssuer = encodeURIComponent(issuer);
    const encodedEmail = encodeURIComponent(email);
    return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${secret}&issuer=${encodedIssuer}&algorithm=SHA1&digits=6&period=30`;
  },

  /**
   * Generates 6-digit TOTP token for given secret and time counter.
   */
  generateToken(secret: string, timeStep: number = Math.floor(Date.now() / 1000 / 30)): string {
    const key = base32Decode(secret);
    const buffer = Buffer.alloc(8);
    buffer.writeBigInt64BE(BigInt(timeStep));

    const hmac = crypto.createHmac('sha1', key);
    hmac.update(buffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0xf;
    const binary =
      ((digest[offset] & 0x7f) << 24) |
      ((digest[offset + 1] & 0xff) << 16) |
      ((digest[offset + 2] & 0xff) << 8) |
      (digest[offset + 3] & 0xff);

    const otp = binary % 1000000;
    return otp.toString().padStart(6, '0');
  },

  /**
   * Verifies TOTP token against secret allowing a clock skew window (±1 step).
   */
  verifyToken(token: string, secret: string, window: number = 1): boolean {
    if (!token || token.length !== 6 || !/^\d+$/.test(token)) {
      return false;
    }

    const currentStep = Math.floor(Date.now() / 1000 / 30);

    for (let errorWindow = -window; errorWindow <= window; errorWindow++) {
      const step = currentStep + errorWindow;
      const expectedToken = this.generateToken(secret, step);
      if (crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))) {
        return true;
      }
    }

    return false;
  },

  /**
   * Generates emergency backup codes.
   */
  generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(`${code.slice(0, 4)}-${code.slice(4)}`);
    }
    return codes;
  },
};
