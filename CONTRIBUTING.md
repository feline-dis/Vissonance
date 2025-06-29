# Contributing to Vissonance

Thank you for your interest in contributing to Vissonance! This guide will help you get started with development and the release process.

## Development Setup

### Prerequisites
- Node.js 14+ 
- npm 6+
- Git

### Getting Started

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Vissonance
   ```

2. **Install dependencies and setup**
   ```bash
   npm run setup
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

This will start a development server at `http://localhost:8080` with hot reloading.

## Project Structure

```
Vissonance/
├── lib/                    # Source code
│   ├── index.js           # Main entry point
│   ├── vissonance.js      # Core Vissonance class
│   ├── audio-analyser.js  # Audio analysis
│   ├── view.js            # WebGL view management
│   └── spectrum.js        # Spectrum utilities
├── presets/               # Visualization presets
├── dist/                  # Built files (generated)
├── .changeset/           # Changeset files
├── .github/workflows/    # GitHub Actions
└── scripts/              # Build and utility scripts
```

## Development Workflow

### Making Changes

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Edit files in `lib/` or `presets/`
   - Test changes with `npm run dev`
   - Run linting with `npm run lint`

3. **Create a changeset**
   ```bash
   npm run changeset
   ```
   
   This will prompt you to:
   - Select the type of change (patch/minor/major)
   - Describe your changes
   - Generate a changeset file

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Types of Changes

- **Patch** (1.0.0 → 1.0.1): Bug fixes, small improvements
- **Minor** (1.0.0 → 1.1.0): New features, new presets
- **Major** (1.0.0 → 2.0.0): Breaking changes to the API

## Build System

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (ESM, CJS, UMD)
- `npm run build:dev` - Build for development
- `npm run build:watch` - Build and watch for changes
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix linting issues
- `npm run changeset` - Create a changeset
- `npm run release:manual` - Manual release process

### Build Outputs

The build process generates three formats:
- **ESM**: `dist/vissonance.esm.js` - ES6 modules
- **CommonJS**: `dist/vissonance.cjs.js` - Node.js compatible
- **UMD**: `dist/vissonance.umd.js` - Universal (browser globals)

## Release Process

### Automated Releases (Recommended)

1. Create changeset with your changes
2. Push to main branch
3. GitHub Actions will:
   - Run tests and build
   - Create a release PR
   - When merged, publish to npm automatically

### Manual Releases

For maintainers only:

```bash
npm run release:manual patch|minor|major
```

This will:
- Run tests and build
- Create changeset
- Update versions
- Create git tag
- Prepare for publishing

## Testing

Currently, the project uses a simple test setup. To run tests:

```bash
npm test
```

### Adding Tests

When adding new features, please include appropriate tests. The project structure supports:
- Unit tests for individual components
- Integration tests for the complete library
- Visual regression tests for presets

## Code Style

The project uses ESLint for code quality. Configuration is in `.eslintrc.js`.

**Key rules:**
- Use ES6+ features
- 2-space indentation
- Single quotes for strings
- Semicolons required
- No unused variables

## Creating New Presets

To add a new visualization preset:

1. **Create preset file**
   ```javascript
   // presets/my-preset.js
   import * as THREE from 'three';

   export default class MyPreset {
     constructor() {
       this.name = 'My Preset';
     }

     init(audioAnalyser, view) {
       this.audioAnalyser = audioAnalyser;
       this.view = view;
     }

     make() {
       // Create your 3D objects here
     }

     render() {
       // Animation logic here
     }

     destroy() {
       // Cleanup
     }
   }
   ```

2. **Add to preset index**
   ```javascript
   // presets/index.js
   import MyPreset from './my-preset.js';

   export const myPreset = {
     name: 'My Preset',
     description: 'Description of your preset',
     class: MyPreset
   };
   ```

3. **Update TypeScript definitions**
   ```typescript
   // presets/index.d.ts
   export declare const myPreset: PresetDefinition;
   ```

## Troubleshooting

### Common Issues

**Build fails**
- Ensure all dependencies are installed: `npm install`
- Clean build cache: `npm run clean && npm run build`

**Linting errors**
- Auto-fix issues: `npm run lint:fix`
- Check ESLint configuration in `.eslintrc.js`

**Development server issues**
- Check if port 8080 is available
- Clear browser cache
- Restart development server

## Questions?

- Open an issue for bugs or feature requests
- Check existing issues for similar problems
- Join our community discussions

Thank you for contributing to Vissonance! 🎵✨ 