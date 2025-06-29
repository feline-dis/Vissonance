#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VALID_VERSIONS = ['patch', 'minor', 'major'];

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

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    if (status.trim()) {
      console.error('❌ Git working directory is not clean. Please commit or stash your changes.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Failed to check git status:', error.message);
    process.exit(1);
  }
}

function getCurrentVersion() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  return packageJson.version;
}

function main() {
  const args = process.argv.slice(2);
  const versionType = args[0];

  if (!versionType) {
    console.error('❌ Please specify version type: patch, minor, or major');
    console.log('Usage: npm run release:manual patch|minor|major');
    process.exit(1);
  }

  if (!VALID_VERSIONS.includes(versionType)) {
    console.error(`❌ Invalid version type: ${versionType}`);
    console.log('Valid types: patch, minor, major');
    process.exit(1);
  }

  console.log(`🚀 Starting ${versionType} release process...`);
  
  const currentVersion = getCurrentVersion();
  console.log(`📦 Current version: ${currentVersion}`);

  // Check git status
  checkGitStatus();

  // Run tests and linting
  run('npm run lint', 'Running linter');
  run('npm test', 'Running tests');

  // Build the project
  run('npm run clean', 'Cleaning previous builds');
  run('npm run build', 'Building project');

  // Create changeset
  console.log('\n📝 Creating changeset...');
  console.log('Please describe your changes in the changeset prompt.');
  run(`npx changeset add`, 'Creating changeset');

  // Version and publish
  run('npx changeset version', 'Updating versions');
  
  const newVersion = getCurrentVersion();
  console.log(`📦 New version: ${newVersion}`);

  // Commit changes
  run('git add .', 'Staging changes');
  run(`git commit -m "chore: release v${newVersion}"`, 'Committing version bump');
  run(`git tag v${newVersion}`, 'Creating git tag');

  console.log('\n🎉 Release prepared successfully!');
  console.log('Next steps:');
  console.log('1. Review the changes: git log --oneline -5');
  console.log('2. Push to remote: git push origin master --tags');
  console.log('3. The CI pipeline will handle the npm publish');
}

if (require.main === module) {
  main();
} 