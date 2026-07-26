// Top common passwords blacklist based on security document specifications
const TOP_COMMON_PASSWORDS = new Set([
  'password', '1234567890', '123456', '12345678', 'password123',
  'admin', 'admin123', 'qwerty1234', 'welcome123', 'letmein123',
  'company123', 'fintrack123', 'iloveyou', 'sunshine', 'princess',
  'football', 'monkey123', 'shadow123', 'master123', 'dragon123',
]);

export interface PasswordValidationResult {
  isValid: boolean;
  error?: string;
}

export function validatePassword(password: string): PasswordValidationResult {
  if (!password || password.length < 10) {
    return {
      isValid: false,
      error: 'Password must be at least 10 characters long.',
    };
  }

  const lower = password.toLowerCase().trim();
  if (TOP_COMMON_PASSWORDS.has(lower)) {
    return {
      isValid: false,
      error: 'Password is too common. Please choose a stronger password.',
    };
  }

  return { isValid: true };
}
