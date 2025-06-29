import iris from './iris.js';
import barred from './barred.js';
import hillfog from './hillfog.js';
import tricentric from './tricentric.js';
import fracture from './fracture.js';
import siphon from './siphon.js';
import silk from './silk.js';

// Export individual presets
export { iris, barred, hillfog, tricentric, fracture, siphon, silk };

// Export presets collection (similar to Butterchurn's getPresets())
export function getPresets() {
  return {
    'Iris': iris,
    'Barred': barred,
    'Hill Fog': hillfog,
    'Tricentric': tricentric,
    'Fracture': fracture,
    'Siphon': siphon,
    'Silk': silk
  };
}

// Default export for convenience
export default {
  iris,
  barred,
  hillfog,
  tricentric,
  fracture,
  siphon,
  silk,
  getPresets
}; 