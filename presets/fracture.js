import * as THREE from 'three';
import Spectrum from '../lib/spectrum.js';

class Fracture {
  constructor() {
    this.name = 'Fracture';
    this.group = null;
    this.group2 = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.spectrum = null;
    
    this.bufferLength = 0;
    this.dataArray = null;
    this.visualArray = null;
    this.fsize = 4096;
    this.numBars = 128;
    this.numBands = 64;
    this.barLen = 150;
    this.barGap = 10;
    this.lastLoudness = 0;
    this.v = this.numBars * 3 * 2 * 2;
    
    this.vertexShader = [
      'varying vec4 pos;',
      'void main() {',
      '  pos = modelViewMatrix * vec4( position, 1.0 );',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n');
    
    this.fragmentShader = [
      'uniform vec3 col;',
      'varying vec4 pos;',
      'void main() {',
      '  gl_FragColor = vec4( -pos.z/500.0 * col.r, -pos.z/500.0 * col.g, -pos.z/500.0 * col.b, 1 );',
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
    
    this.view.renderer.autoClearColor = true;
    this.view.renderer.setClearColor(new THREE.Color('hsl(0, 0%, 100%)'), 1);

    this.view.usePerspectiveCamera();
    this.view.camera.position.y = 0;
    this.view.camera.position.z = 0;

    let positionZ = 10;

    for (let i = 0; i < this.numBands; i++) {
      const geometry = new THREE.PlaneGeometry(this.barLen * 2, 10, (this.numBars * 2) - 1);
      const uniforms = {
        col: { type: 'c', value: new THREE.Color('hsl(240, 100%, 50%)') },
      };
      
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader
      });
      
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = -Math.PI / 2;
      plane.position.y = -10;
      plane.position.z = positionZ;
      positionZ -= this.barGap;
      
      this.group.add(plane);
    }
    
    this.scene.add(this.group);

    // Create mirrored group
    this.group2 = this.group.clone();
    this.group2.rotation.z = Math.PI;
    this.scene.add(this.group2);
  }

  destroy() {
    if (this.scene && this.group) {
      this.scene.remove(this.group);
    }
    if (this.scene && this.group2) {
      this.scene.remove(this.group2);
    }
    if (this.view.renderer) {
      this.view.renderer.autoClearColor = false;
    }
  }

  render() {
    if (!this.analyser || !this.group) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numBars, -200, 1300);
    const loudness = this.getLoudness(this.dataArray);
    
    // Smooth loudness (prepared for future features)
    const _smoothLoudness = (loudness + this.lastLoudness) / 2; // eslint-disable-line no-unused-vars
    
    this.view.camera.rotation.z -= (loudness <= 1) ? 0 : (Math.pow((loudness / 8192) + 1, 2) - 1) / 2;
    
    if (this.group) {
      const yOffset = (loudness <= 1) ? -10 : -10 + Math.min((loudness / 255) * 20, 9.8);
      this.group.position.y = yOffset;
      this.group2.position.y = -yOffset;
      
      for (let c = 0; c < this.group.children.length; c++) {
        const zMovement = (loudness <= 1) ? 0 : (Math.pow((loudness / 8192) + 1, 2) - 1) * loudness * 1.7;
        this.group.children[c].position.z += zMovement;
        this.group2.children[c].position.z += zMovement;
        
        // Reset position when out of sight
        if (this.group.children[c].position.z > 20) {
          this.group.children[c].position.z -= this.numBands * this.barGap;
          this.group2.children[c].position.z -= this.numBands * this.barGap;
        }
        
        this.setUniformColor(c, loudness);
        
        // Update geometry based on visualArray
        for (let i = 0; i < this.visualArray.length; i++) {
          if (c % 2 !== 0) {
            this.group.children[c].geometry.attributes.position.array[i * 3 + 2] = this.visualArray[i] / 10;
            this.group.children[c].geometry.attributes.position.needsUpdate = true;
          } else {
            const index = (this.v / 2 - 3) - ((this.numBars * 3) + (i * 3)) + 2 + (this.numBars * 3);
            this.group.children[c].geometry.attributes.position.array[index] = this.visualArray[i] / 10;
            this.group.children[c].geometry.attributes.position.needsUpdate = true;
          }
        }
      }
    }
    
    this.lastLoudness = loudness;
  }

  setUniformColor(groupIndex, loudness) {
    const h = this.modn(250 - (loudness * 2.2), 360);
    this.group.children[groupIndex].material.uniforms.col.value = new THREE.Color(`hsl(${h}, 100%, 50%)`);
  }

  getLoudness(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }

  modn(n, m) {
    return ((n % m) + m) % m;
  }
}

export default {
  name: 'Fracture',
  description: 'Complex layered plane visualization with depth effects',
  class: Fracture
}; 