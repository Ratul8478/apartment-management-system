import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@/types';
import { mfa } from '@/lib/security/mfa';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        totpToken: { label: '2FA Code', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Incorrect email or password.');
        }

        const email = credentials.email.toLowerCase().trim();

        try {
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            // Generic message to prevent email enumeration
            throw new Error('Incorrect email or password.');
          }

          if (!user.isActive) {
            throw new Error('Account is deactivated. Contact Admin.');
          }

          // Check account lockout
          if (user.lockoutUntil && user.lockoutUntil > new Date()) {
            const minutesLeft = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 60000);
            throw new Error(`Account locked due to 5 failed attempts. Try again in ${minutesLeft} minutes.`);
          }

          const isValidPassword = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isValidPassword) {
            const newAttempts = user.failedLoginAttempts + 1;
            let lockoutUntil = null;

            if (newAttempts >= 5) {
              lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes lockout
              // Log security audit log for lockout
              await prisma.auditLog.create({
                data: {
                  actorUserId: user.id,
                  action: 'ACCOUNT_LOCKOUT',
                  targetTable: 'users',
                  targetId: user.id,
                  metadata: JSON.stringify({ reason: '5 failed login attempts', lockoutUntil }),
                },
              });
            }

            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: newAttempts,
                lockoutUntil,
              },
            });

            throw new Error('Incorrect email or password.');
          }

          // Check Multi-Factor Authentication (MFA / 2FA)
          if (user.mfaEnabled && user.mfaSecret) {
            const totpCode = credentials.totpToken;
            if (!totpCode || !mfa.verifyToken(totpCode, user.mfaSecret)) {
              throw new Error('MFA_REQUIRED: Invalid or missing 2FA code.');
            }
          }

          // Reset failed attempts on successful login
          if (user.failedLoginAttempts > 0 || user.lockoutUntil) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: 0,
                lockoutUntil: null,
              },
            });
          }

          // Audit log successful login
          await prisma.auditLog.create({
            data: {
              actorUserId: user.id,
              action: 'LOGIN_SUCCESS',
              targetTable: 'users',
              targetId: user.id,
              metadata: JSON.stringify({ email: user.email, role: user.role }),
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role as UserRole,
            mfaEnabled: user.mfaEnabled,
          };
        } catch (error: any) {
          console.error('Auth attempt failed:', error.message);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.mfaEnabled = (user as any).mfaEnabled;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).mfaEnabled = token.mfaEnabled;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fintrack-pro-production-secret-jwt-key-2026',
};
