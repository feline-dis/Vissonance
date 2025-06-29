import AudioAnalyser = require('./audio-analyser');
import View = require('./view');

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

export interface VisualizationPreset {
  name: string;
  group: THREE.Object3D | null;
  analyser: AnalyserNode | null;
  view: View | null;
  scene: THREE.Scene | null;
  spectrum: any | null;
  
  init(audioAnalyser: AudioAnalyser, view: View): void;
  make(): void;
  render(): void;
  destroy(): void;
}

declare class Vissonance {
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

export = Vissonance; 