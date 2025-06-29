import * as THREE from 'three';

// Core interfaces and types
export interface VissonanceOptions {
  width?: number;
  height?: number;
  [key: string]: any;
}

export interface PresetDefinition {
  name: string;
  description: string;
  class: new () => VisualizationPreset;
}

export interface PresetCollection {
  [key: string]: PresetDefinition;
}

// Base visualization preset interface
export interface VisualizationPreset {
  name: string;
  group: THREE.Object3D | null;
  analyser: AnalyserNode | null;
  view: View | null;
  scene: THREE.Scene | null;
  spectrum: Spectrum | null;
  
  init(audioAnalyser: AudioAnalyser, view: View): void;
  make(): void;
  render(): void;
  destroy(): void;
}

// AudioAnalyser class
export declare class AudioAnalyser {
  audioCtx: AudioContext;
  analyser: AnalyserNode | null;
  gainNode: GainNode | null;
  source: AudioBufferSourceNode | null;
  audioNode: AudioNode | null;
  
  constructor(audioContext: AudioContext);
  
  init(): void;
  connect(audioNode: AudioNode): void;
  makeAudio(data: ArrayBuffer): void;
  playAudio(): void;
  setGain(value: number): void;
  destroy(): void;
}

// View class
export declare class View {
  canvas: HTMLCanvasElement;
  options: VissonanceOptions;
  scene: THREE.Scene | null;
  renderer: THREE.WebGLRenderer | null;
  camera: THREE.Camera | null;
  renderVisualization: (() => void) | null;
  
  constructor(canvas: HTMLCanvasElement, options?: VissonanceOptions);
  
  init(): void;
  usePerspectiveCamera(): void;
  useOrthographicCamera(): void;
  setSize(width: number, height: number): void;
  onWindowResize(): void;
  setRenderFunction(renderFunction: () => void): void;
  render(): void;
  destroy(): void;
}

// Spectrum class
export declare class Spectrum {
  spectrumDimensionScalar: number;
  spectrumMaxExponent: number;
  spectrumMinExponent: number;
  spectrumExponentScale: number;
  spectrumHeight: number;
  
  constructor();
  
  getVisualBins(
    dataArray: Uint8Array, 
    numElements: number, 
    spectrumStart: number, 
    spectrumEnd: number
  ): number[];
  exponentialTransform(array: number[]): number[];
  spectrumEase(v: number): number;
}

// Main Vissonance class
export declare class Vissonance {
  audioContext: AudioContext;
  canvas: HTMLCanvasElement;
  options: VissonanceOptions;
  audioAnalyser: AudioAnalyser | null;
  view: View | null;
  currentPreset: VisualizationPreset | null;
  animationId: number | null;
  isInitialized: boolean;
  
  constructor(audioContext: AudioContext, canvas: HTMLCanvasElement, options?: VissonanceOptions);
  
  init(): void;
  connectAudio(audioNode: AudioNode): void;
  loadPreset(preset: PresetDefinition, blendTime?: number): void;
  setRendererSize(width: number, height: number): void;
  render(): void;
  startRenderLoop(): void;
  stopRenderLoop(): void;
  destroy(): void;
  
  static createVisualizer(
    audioContext: AudioContext, 
    canvas: HTMLCanvasElement, 
    options?: VissonanceOptions
  ): Vissonance;
}

// Preset exports namespace
export declare namespace presets {
  export const iris: PresetDefinition;
  export const barred: PresetDefinition;
  export const hillfog: PresetDefinition;
  export const tricentric: PresetDefinition;
  export const fracture: PresetDefinition;
  export const siphon: PresetDefinition;
  export const silk: PresetDefinition;
  
  export function getPresets(): PresetCollection;
}

// Default export
export default Vissonance;

// CommonJS compatibility
declare module 'vissonance' {
  export = Vissonance;
  namespace Vissonance {
    export { presets };
  }
} 