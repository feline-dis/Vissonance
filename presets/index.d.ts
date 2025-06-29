import { PresetDefinition, PresetCollection } from '../lib/vissonance';

export const iris: PresetDefinition;
export const barred: PresetDefinition;
export const hillfog: PresetDefinition;
export const tricentric: PresetDefinition;
export const fracture: PresetDefinition;
export const siphon: PresetDefinition;
export const silk: PresetDefinition;

export function getPresets(): PresetCollection;

declare const presets: {
  iris: PresetDefinition;
  barred: PresetDefinition;
  hillfog: PresetDefinition;
  tricentric: PresetDefinition;
  fracture: PresetDefinition;
  siphon: PresetDefinition;
  silk: PresetDefinition;
  getPresets: () => PresetCollection;
};

export default presets; 