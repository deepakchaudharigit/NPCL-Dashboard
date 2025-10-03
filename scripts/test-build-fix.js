#!/usr/bin/env node

/**
 * Test Build Fix Script
 * Tests if build issues have been resolved
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Testing build fixes...');

const tests = [
  {
    name: 'TypeScript Compilation',
    test: () => {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        return { passed: true, message: 'TypeScript compilation successful' };
      } catch (error) {
        return { passed: false, message: 'TypeScript compilation failed' };
      }
    }
  },
  {
    name: 'ESLint Check',
    test: () => {
      try {
        execSync('npx eslint . --ext .ts,.tsx --max-warnings 0', { stdio: 'pipe' });
        return { passed: true, message: 'ESLint check passed' };
      } catch (error) {
        return { passed: false, message: 'ESLint check failed' };
      }
    }
  },
  {
    name: 'Next.js Config',
    test: () => {
      const configPath = path.join(process.cwd(), 'next.config.js');
      if (fs.existsSync(configPath)) {
        const config = fs.readFileSync(configPath, 'utf8');
        const hasValidConfig = !config.includes('swcMinify: false');
        return { 
          passed: hasValidConfig, 
          message: hasValidConfig ? 'Next.js config is valid' : 'Next.js config needs updates' 
        };
      }
      return { passed: false, message: 'Next.js config not found' };
    }
  },
  {
    name: 'Package Dependencies',
    test: () => {
      try {
        execSync('npm ls --depth=0', { stdio: 'pipe' });
        return { passed: true, message: 'All dependencies are installed' };
      } catch (error) {
        return { passed: false, message: 'Missing or conflicting dependencies' };
      }
    }
  }
];

console.log('\n📊 Running build fix tests...\n');

let allPassed = true;

tests.forEach((test, index) => {
  process.stdout.write(`${index + 1}. ${test.name}... `);
  const result = test.test();
  
  if (result.passed) {
    console.log('✅', result.message);
  } else {
    console.log('❌', result.message);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 All build fix tests passed!');
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm run build');
  console.log('2. Run: npm run test');
  console.log('3. Run: npm run audit:lighthouse');
} else {
  console.log('❌ Some build fix tests failed');
  console.log('\n🔧 Please address the failing tests above');
  process.exit(1);
}