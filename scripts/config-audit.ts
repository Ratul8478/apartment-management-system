import fs from 'fs';
import path from 'path';
import { configurationSchema } from '../src/lib/config/schema';

/**
 * FinTrack Pro — Configuration Audit & Drift Prevention Script
 * 
 * Verifies 1:1 key alignment between Zod validation schema (schema.ts)
 * and developer environment template (.env.example).
 * Executed in CI pre-flight pipelines (`npm run config:audit`).
 */

function auditConfiguration(): void {
  console.log('=====================================================');
  console.log('🔍 FINTRACK PRO CONFIGURATION DRIFT AUDIT');
  console.log('=====================================================\n');

  const envExamplePath = path.resolve(process.cwd(), '.env.example');

  if (!fs.existsSync(envExamplePath)) {
    console.error('❌ ERROR: .env.example file not found at project root!');
    process.exit(1);
  }

  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Extract keys from .env.example (lines starting with KEY=)
  const envExampleKeys = new Set<string>();
  const lines = envExampleContent.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([A-Z0-9_]+)=/);
      if (match) {
        envExampleKeys.add(match[1]);
      }
    }
  }

  const schemaKeys = new Set(Object.keys(configurationSchema.shape));
  let driftDetected = false;

  // Check 1: Keys in Schema but missing in .env.example
  const missingInExample: string[] = [];
  schemaKeys.forEach((key) => {
    if (!envExampleKeys.has(key)) {
      missingInExample.push(key);
    }
  });

  if (missingInExample.length > 0) {
    driftDetected = true;
    console.error('❌ DRIFT DETECTED: Keys present in Zod schema but MISSING in .env.example:');
    missingInExample.forEach((key) => console.error(`   • ${key}`));
    console.error('');
  }

  // Check 2: Keys in .env.example but missing in Schema
  const missingInSchema: string[] = [];
  envExampleKeys.forEach((key) => {
    if (!schemaKeys.has(key)) {
      missingInSchema.push(key);
    }
  });

  if (missingInSchema.length > 0) {
    driftDetected = true;
    console.error('❌ DRIFT DETECTED: Keys present in .env.example but MISSING in Zod schema:');
    missingInSchema.forEach((key) => console.error(`   • ${key}`));
    console.error('');
  }

  if (driftDetected) {
    console.error('=====================================================');
    console.error('❌ AUDIT FAILED: Fix configuration drift before merging!');
    console.error('=====================================================\n');
    process.exit(1);
  } else {
    console.log('✅ AUDIT PASSED: 100% Key Parity between Zod Schema and .env.example!');
    console.log(`   Total Validated Configuration Keys: ${schemaKeys.size}`);
    console.log('=====================================================\n');
  }
}

auditConfiguration();
