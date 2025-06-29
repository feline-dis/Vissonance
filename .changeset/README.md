# Changesets

This directory contains changeset files for managing version bumps and generating changelogs.

## How to use

When you make changes that should be included in a release, run:

```bash
npm run changeset
```

This will:
1. Ask you which packages should be bumped (patch, minor, major)
2. Ask for a summary of the changes
3. Create a changeset file describing the changes

## Release Process

### For maintainers:

1. **Create changesets** for your changes:
   ```bash
   npm run changeset
   ```

2. **Version packages** (updates package.json versions and CHANGELOG.md):
   ```bash
   npm run changeset:version
   ```

3. **Publish** (done automatically via GitHub Actions on main branch):
   ```bash
   npm run changeset:publish
   ```

### Automated releases:

The CI pipeline will automatically:
- Create release PRs when changesets are detected
- Publish packages when release PRs are merged
- Generate changelogs
- Create git tags

## Changeset Types

- **patch**: Bug fixes and small improvements
- **minor**: New features that don't break existing functionality  
- **major**: Breaking changes

## Example Changeset

When you run `npm run changeset`, you might create something like:

```md
---
"vissonance": minor
---

Add new Plasma visualization preset with dynamic particle effects
``` 