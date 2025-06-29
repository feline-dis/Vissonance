import Vissonance from './vissonance';
import * as presets from '../presets/index';

export default Vissonance;
export { presets };

// CommonJS compatibility
declare namespace VissonanceLib {
  export default Vissonance;
  export { presets };
}

export = VissonanceLib; 