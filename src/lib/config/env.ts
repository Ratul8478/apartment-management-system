import { configurationSchema, AppConfiguration } from './schema';

/**
 * FinTrack Pro — Centralized Fail-Fast Configuration Loader
 * 
 * Parses `process.env` through Zod schema at application boot.
 * If validation fails, logs detailed diagnostic output and executes `process.exit(1)`.
 */

function validateAndExportConfiguration(): AppConfiguration {
  const result = configurationSchema.safeParse(process.env);

  if (!result.success) {
    console.error('=====================================================');
    console.error('❌ FATAL: FINTRACK PRO CONFIGURATION VALIDATION FAILURE');
    console.error('=====================================================');
    console.error('The application failed to start due to invalid or missing environment variables:\n');

    const formattedErrors = result.error.format();
    
    Object.entries(formattedErrors).forEach(([key, errorVal]) => {
      if (key !== '_errors' && errorVal && '_errors' in errorVal) {
        const fieldErrors = (errorVal as { _errors: string[] })._errors;
        if (fieldErrors.length > 0) {
          console.error(`  • [${key}]: ${fieldErrors.join(', ')}`);
        }
      }
    });

    console.error('\nREMEDIATION INSTRUCTIONS:');
    console.error('1. Check your .env.local file or container environment variables.');
    console.error('2. Compare required variables against .env.example.');
    console.error('3. Ensure variable types match (URLs, numbers, booleans, secret lengths).');
    console.error('=====================================================\n');

    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    } else {
      throw new Error('Configuration validation failed in test environment');
    }
  }

  // Deep freeze the configuration object to enforce immutability at runtime
  return Object.freeze(result.data);
}

export const env: AppConfiguration = validateAndExportConfiguration();

/**
 * Helper utility to verify server-side runtime before accessing server secrets.
 */
export function assertServerOnly(variableName: string): void {
  if (typeof window !== 'undefined') {
    throw new Error(
      `SECURITY VIOLATION: Attempted to access server-only configuration '${variableName}' on the client DOM!`
    );
  }
}
