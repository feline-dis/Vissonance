import * as THREE from 'three';
import Spectrum from '../lib/spectrum.js';

class Barred {
  constructor() {
    this.name = 'Barred';
    this.group = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.spectrum = null;
    
    this.bufferLength = 0;
    this.dataArray = null;
    this.visualArray = null;
    this.fsize = 4096;
    this.numBars = 64;
    
    this.vertexShader = [
      'void main() {',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n');
    
    this.fragmentShader = [
      'void main() {',
      '  gl_FragColor = vec4( gl_FragCoord.y/500.0, 0, gl_FragCoord.y/1000.0, 1.0 );',
      '}'
    ].join('\n');
  }

  init(audioAnalyser, view) {
    this.analyser = audioAnalyser.analyser;
    this.view = view;
    this.scene = view.scene;
  }

  make() {
    this.group = new THREE.Object3D();
    this.spectrum = new Spectrum();
    this.analyser.fftSize = this.fsize;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);

    this.view.useOrthographicCamera();

    let positionX = -20 * (this.numBars / 2);

    for (let i = 0; i < this.numBars; i++) {
      const geometry = new THREE.PlaneGeometry(18, 5, 1);
      const uniforms = {};
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader
      });
      
      const plane = new THREE.Mesh(geometry, material);
      plane.position.x = positionX;
      positionX += 20;
      
      this.group.add(plane);
    }
    
    this.scene.add(this.group);
  }

  destroy() {
    if (this.scene && this.group) {
      this.scene.remove(this.group);
    }
  }

  render() {
    if (!this.analyser || !this.group) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numBars, 4, 1300);
    
    if (this.group) {
      for (let i = 0; i < this.visualArray.length; i++) {
        this.group.children[i].geometry.attributes.position.array[1] = this.visualArray[i];
        this.group.children[i].geometry.attributes.position.array[4] = this.visualArray[i];
        this.group.children[i].geometry.attributes.position.needsUpdate = true;
      }
    }
  }
}

export default {
  name: 'Barred',
  description: 'Traditional bar visualization with vertical bars',
  class: Barred
}; 