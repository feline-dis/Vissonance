# Vissonance

Vissonance is a WebGL audio visualizer package built with Three.js, offering stunning real-time audio visualizations. Create beautiful, responsive visual experiences that react to music and audio input.

## Credits

This project is a fork of [Vissonance](https://github.com/tariqksoliman/Vissonance) by [@tariqksoliman](https://github.com/tariqksoliman). The API design and usage patterns are inspired by [Butterchurn](https://github.com/jberg/butterchurn) by [@jberg](https://github.com/jberg), a fantastic WebGL implementation of the Milkdrop visualizer.

## Features

- **7 Built-in Presets**: Beautiful, unique visualization styles
- **WebGL Powered**: High-performance rendering using Three.js
- **Easy Integration**: Simple API similar to Butterchurn
- **Flexible Audio Input**: Works with audio files, microphone, or any Web Audio API source
- **Responsive**: Automatic canvas resizing and device pixel ratio support
- **Modern ES6**: Clean, modular code structure

## Installation

```bash
npm install vissonance
```

## Quick Start

```javascript
import Vissonance from 'vissonance';
import { getPresets } from 'vissonance/presets';

// Initialize audio context and get canvas
const audioContext = new AudioContext();
const canvas = document.getElementById('myCanvas');

// Create visualizer
const visualizer = Vissonance.createVisualizer(audioContext, canvas, {
  width: 800,
  height: 600
});

// Connect audio source (from audio element, microphone, etc.)
const audioElement = document.getElementById('myAudio');
const audioSource = audioContext.createMediaElementSource(audioElement);
visualizer.connectAudio(audioSource);

// Load a preset
const presets = getPresets();
visualizer.loadPreset(presets['Iris']);

// The visualizer will automatically start rendering!
```

## Available Presets

- **Iris**: Radial bars that pulse and change color with the music
- **Barred**: Traditional bar visualization with vertical bars
- **Hill Fog**: Waveform visualization creating a foggy hill effect
- **Tricentric**: Rotating cylindrical visualization with dynamic scaling
- **Fracture**: Complex layered plane visualization with depth effects
- **Siphon**: Tubular visualization with dynamic scaling and color effects
- **Silk**: Flowing circular patterns with silk-like movement

## API Reference

### Vissonance Class

#### Constructor
```javascript
new Vissonance(audioContext, canvas, options)
```

- `audioContext`: Web Audio API AudioContext
- `canvas`: HTML Canvas element
- `options`: Configuration object
  - `width`: Canvas width (default: canvas.width || 800)
  - `height`: Canvas height (default: canvas.height || 600)

#### Static Methods

##### `Vissonance.createVisualizer(audioContext, canvas, options)`
Creates a new Vissonance instance (recommended method).

#### Instance Methods

##### `connectAudio(audioNode)`
Connect an audio node to the visualizer.
- `audioNode`: Web Audio API AudioNode

##### `loadPreset(preset, blendTime = 0.0)`
Load a visualization preset.
- `preset`: Preset object from getPresets()
- `blendTime`: Transition time in seconds (currently unused)

##### `setRendererSize(width, height)`
Resize the visualization canvas.
- `width`: New width in pixels
- `height`: New height in pixels

##### `render()`
Manually render a single frame (automatic rendering starts by default).

##### `destroy()`
Clean up and destroy the visualizer instance.

### Presets

#### `getPresets()`
Returns an object containing all available presets:

```javascript
import { getPresets } from 'vissonance/presets';

const presets = getPresets();
// {
//   'Iris': { name: 'Iris', description: '...', class: IrisClass },
//   'Barred': { name: 'Barred', description: '...', class: BarredClass },
//   // ... etc
// }
```

#### Individual Preset Imports
```javascript
import { iris, barred, hillfog } from 'vissonance/presets';
```

## TypeScript Support

Vissonance includes comprehensive TypeScript declarations for full type safety and IntelliSense support.

### Installation with TypeScript
```bash
npm install vissonance
npm install --save-dev @types/three
```

### Basic TypeScript Usage
```typescript
import Vissonance, { presets } from 'vissonance';

// Type-safe initialization
const audioContext = new AudioContext();
const canvas = document.getElementById('canvas') as HTMLCanvasElement;

const visualizer = new Vissonance(audioContext, canvas, {
  width: 800,
  height: 600
});

// Type-safe preset loading
visualizer.loadPreset(presets.iris);

// Access all presets with full type information
const allPresets = presets.getPresets();
const fracture = allPresets['Fracture'];
```

### Interface Definitions

The package exports several useful TypeScript interfaces:

```typescript
import { VissonanceOptions, PresetDefinition, VisualizationPreset } from 'vissonance';

// Configuration options
interface VissonanceOptions {
  width?: number;
  height?: number;
  [key: string]: any;
}

// Preset structure
interface PresetDefinition {
  name: string;
  description: string;
  class: new () => VisualizationPreset;
}

// Base preset interface for creating custom presets
interface VisualizationPreset {
  name: string;
  init(audioAnalyser: AudioAnalyser, view: View): void;
  make(): void;
  render(): void;
  destroy(): void;
}
```

### Creating Custom Presets with TypeScript

```typescript
import { VisualizationPreset, AudioAnalyser, View } from 'vissonance';
import * as THREE from 'three';

class MyCustomPreset implements VisualizationPreset {
  name = 'My Custom Preset';
  group: THREE.Object3D | null = null;
  
  init(audioAnalyser: AudioAnalyser, view: View): void {
    // Initialize your preset
  }
  
  make(): void {
    // Create your visualization objects
  }
  
  render(): void {
    // Update visualization each frame
  }
  
  destroy(): void {
    // Clean up resources
  }
}

// Use your custom preset
const customPreset = {
  name: 'My Custom',
  description: 'A custom visualization',
  class: MyCustomPreset
};

visualizer.loadPreset(customPreset);
```

## Usage Examples

### With Audio File
```javascript
import Vissonance from 'vissonance';
import { getPresets } from 'vissonance/presets';

const audioContext = new AudioContext();
const canvas = document.getElementById('canvas');
const audioElement = document.getElementById('audio');

// Create visualizer
const visualizer = Vissonance.createVisualizer(audioContext, canvas);

// Connect audio
const audioSource = audioContext.createMediaElementSource(audioElement);
visualizer.connectAudio(audioSource);

// Load preset
const presets = getPresets();
visualizer.loadPreset(presets['Fracture']);
```

### With Microphone Input
```javascript
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const audioContext = new AudioContext();
    const micSource = audioContext.createMediaStreamSource(stream);
    
    const visualizer = Vissonance.createVisualizer(audioContext, canvas);
    visualizer.connectAudio(micSource);
    visualizer.loadPreset(presets['Silk']);
  });
```

### Responsive Canvas
```javascript
const visualizer = Vissonance.createVisualizer(audioContext, canvas, {
  width: window.innerWidth,
  height: window.innerHeight
});

// Handle resize
window.addEventListener('resize', () => {
  visualizer.setRendererSize(window.innerWidth, window.innerHeight);
});
```

## Browser Support

Vissonance requires:
- WebGL support
- Web Audio API support
- ES6 modules support
- Import maps support (or a bundler for Three.js resolution)

Modern browsers (Chrome 89+, Firefox 108+, Safari 16.4+, Edge 89+) are supported.

### Three.js Import Resolution

The package imports Three.js as `import * as THREE from 'three'`. For this to work in browsers, you need one of:

**Option 1: Import Map (Recommended)**
```html
<script type="importmap">
{
  "imports": {
    "three": "https://unpkg.com/three@0.158.0/build/three.module.js"
  }
}
</script>
```

**Option 2: Use a bundler** (Webpack, Vite, etc.) that resolves node modules

**Option 3: Replace imports** with CDN URLs in the source files

## Development

### Building from Source

```bash
git clone https://github.com/yourusername/vissonance.git
cd vissonance
npm install
npm run build
```

### Running the Example

Open `example.html` in a modern browser or serve it from a local web server:

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000/example.html`

## License

MIT License - see LICENSE file for details.

## Acknowledgments

- **Original Project**: Forked from [Vissonance](https://github.com/tariqksoliman/Vissonance) by [@tariqksoliman](https://github.com/tariqksoliman)
- **API Inspiration**: Usage patterns inspired by [Butterchurn](https://github.com/jberg/butterchurn) by [@jberg](https://github.com/jberg)
- **Built with**: [Three.js](https://threejs.org/) for WebGL rendering
- **Inspired by**: Classic music visualizers like Milkdrop and Winamp
- **Audio Analysis**: Utilities adapted from various WebGL visualization projects

## Contributing

Contributions are welcome! Please read the contributing guidelines and submit pull requests for any improvements.

## Changelog

### v1.0.0
- Initial release
- 7 built-in visualization presets
- Full Web Audio API integration
- Responsive canvas support
- ES6 module structure

## Music

The demo uses the following tracks:  
*I tried to find copyright free songs. If one of the following songs is yours and you'd like it taken down, I'll happily do it.*

* DM Galaxy - Bad Motives (ft. Aloma Steele)  
  * Released by [No Copyright Sounds](https://www.youtube.com/user/NoCopyrightSounds)  
    [Spotify](http://spoti.fi/NCS) | [SoundCloud](http://soundcloud.com/nocopyrightsounds) | [Facebook](http://facebook.com/NoCopyrightSounds) | [Twitter](http://twitter.com/NCSounds) | [Google+](http://google.com/+nocopyrightsounds)  

  * DM Galaxy  
    [SoundCloud](http://soundcloud.com/dmgalaxy) | [Facebook](http://www.facebook.com/DmGalaxy)  

* FREYER - Borrow (ft. Jordan Kaahn) 
  * From [Zero Copyright Music](https://www.youtube.com/channel/UCFDu_q_3Jnv8nxL7FhWtJVg)  

  * Released by Future Rave Records  
    [Soundcloud](https://soundcloud.com/futurerave) | [Facebook](https://www.facebook.com/futureraverecords) | [Instagram](https://www.instagram.com/futureraverecords/) | [Twitter](https://twitter.com/futureraverec)

  * FREYER  
    [Soundcloud](https://soundcloud.com/iamfreyer) | [Facebook](https://www.facebook.com/Freyerdj) | [Twitter](https://twitter.com/freyerofficial) | [Instagram](https://www.instagram.com/freyersounds/)

  * Jordan Kaahn  
    [Soundcloud](https://soundcloud.com/jordankaahn) | [Facebook](https://www.facebook.com/jordankaahn) | [Twitter](https://twitter.com/jordankaahn) | [Instagram](https://www.instagram.com/jordankaahn/)

* Goblins from Mars - Cold Blooded Love (ft. Krista Marina)  
  * Released by [Goblins from Mars](https://www.youtube.com/channel/UC7r8TN-JGGrTyCmIJSShdkw)  
  * Goblins from Mars  
    [Facebook](https://www.facebook.com/goblinsfrommars) | [Soundcloud](https://soundcloud.com/goblinsfrommars) | [Twitter](https://twitter.com/boris_and_mike) | [Instagram](https://www.instagram.com/goblins_from_mars/) | [Spotify](https://play.spotify.com/artist/43X1WUBfHuL1XJYckslH5U?play=true&utm_source=open.spotify.com&utm_medium=open)  

  * Krista Marina  
    [Facebook](https://www.facebook.com/kristamarinamusic) | [Youtube](https://www.youtube.com/channel/UC0BEb1bKsrOyuL_MKcAIZsw) | [Soundcloud](https://soundcloud.com/kristamarina)

* Sex Whales & Roee Yeger - Where Was I (ft. Ashley Apollodor)
    * Released by [No Copyright Sounds](https://www.youtube.com/user/NoCopyrightSounds)  
      [Spotify](http://spoti.fi/NCS) | [SoundCloud](http://soundcloud.com/nocopyrightsounds) | [Facebook](http://facebook.com/NoCopyrightSounds) | [Twitter](http://twitter.com/NCSounds) | [Google+](http://google.com/+nocopyrightsounds)
  
  * Sex Whales  
    [Facebook](https://www.facebook.com/SexWhalesOff) | [Instagram](https://instagram.com/talrochman/) | [Soundcloud](https://soundcloud.com/sex-whales) | [Twitter](https://twitter.com/sex_whales7)

  * Roee Yeger  
    [Facebook](https://www.facebook.com/roeeyegermusic) | [Soundcloud](https://soundcloud.com/roee-yeger) | [YouTube](https://www.youtube.com/user/RoeeYegerOfficial)

  * Ashley Apollodor  
    [Facebook](http://www.facebook.com/BeneathHerSkin/) | [Instagram](http://instagram.com/ashleyapollodor/) | [Soundcloud](http://soundcloud.com/ashleyapollodor)