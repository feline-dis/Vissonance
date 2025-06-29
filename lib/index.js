import Vissonance from './vissonance.js';
import * as presets from '../presets/index.js';

export default Vissonance;
export { presets };

// Compatibility for CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Vissonance;
  module.exports.presets = presets;
  module.exports.default = Vissonance;
} 