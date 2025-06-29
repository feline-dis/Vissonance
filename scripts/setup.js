#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

function run(command, description) {
  console.log(`\n🔄 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: process.cwd() });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    process.exit(1);
  }
}

function main() {
  console.log('🚀 Setting up Vissonance development environment...\n');

  // Install dependencies
  run('npm install', 'Installing dependencies');

  // Initialize changeset if not already done
  if (!fs.existsSync('.changeset/config.json')) {
    run('npx changeset init', 'Initializing changesets');
  }

  // Create initial build
  run('npm run build', 'Creating initial build');

  // Run linter to check code
  run('npm run lint', 'Running linter');

  console.log('\n🎉 Setup complete!');
  console.log('\nNext steps:');
  console.log('1. Start development server: npm run dev');
  console.log('2. Create a changeset: npm run changeset');
  console.log('3. Build for production: npm run build');
  console.log('4. Deploy: Push to main branch (automated via GitHub Actions)');
  console.log('\n📚 See README.md for full documentation');
}

if (require.main === module) {
  main();
} 