/**
 * FinTrack Pro — Production Deployment Automation Helper
 */
const { execSync } = require('child_process');

console.log('🚀 Initiating FinTrack Pro Production Deployment Sequence...');

try {
  console.log('1. Running Pre-Flight Production Checks...');
  execSync('node scripts/verify-production.js', { stdio: 'inherit' });

  console.log('\n2. Building Production Next.js Bundle...');
  execSync('npm run build', { stdio: 'inherit' });

  console.log('\n✅ Build succeeded. Ready for Vercel / Render deployment.');
} catch (err) {
  console.error('\n❌ Deployment failed at pre-flight step:', err.message);
  process.exit(1);
}
