import * as THREE from 'three';
import { VissonanceOptions } from './vissonance';

declare class View {
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

export = View; 