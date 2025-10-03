#!/usr/bin/env node

/**
 * Quick Build Test Script
 * Performs a fast build test without full compilation
 */

const { execSync } = require('child_process');

console.log('⚡ Running quick build test...');

try {
  // Quick TypeScript check
  console.log('🔍 Checking TypeScript...');
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'inherit' });
  
  // Quick lint check
  console.log('🔍 Running quick lint...');
  execSync('npx eslint . --ext .ts,.tsx --max-warnings 0 --quiet', { stdio: 'inherit' });
  
  console.log('\n✅ Quick build test passed!');
  console.log('\n📋 Checks completed:');
  console.log('  ✅ TypeScript compilation');
  console.log('  ✅ ESLint validation');
  
  console.log('\n🚀 Ready for full build:');
  console.log('npm run build');
  
} catch (error) {
  console.error('❌ Quick build test failed');
  console.error('Please fix the issues above before proceeding');
  process.exit(1);
}