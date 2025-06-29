import * as THREE from 'three';
import Spectrum from '../lib/spectrum.js';

class Tricentric {
  constructor() {
    this.name = 'Tricentric';
    this.group = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.spectrum = null;
    
    this.bufferLength = 0;
    this.dataArray = null;
    this.visualArray = null;
    this.fsize = 4096;
    this.numBars = 32;
    
    this.vertexShader = [
      'void main() {',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n');
    
    this.fragmentShader = [
      'uniform vec3 col;',
      'uniform float alpha;',
      'void main() {',
      '  gl_FragColor = vec4( col.r, col.g, col.b, alpha );',
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

    this.view.usePerspectiveCamera();
    this.view.camera.position.y = 0;

    let positionZ = 498;

    for (let i = 0; i < this.numBars; i++) {
      const geometry = new THREE.CylinderGeometry(20, 20, 2, 3, 1, true);
      const uniforms = {
        col: { type: 'c', value: new THREE.Color('hsl(250, 100%, 70%)') },
        alpha: { type: 'f', value: 1 }
      };
      
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        side: THREE.DoubleSide
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.z = positionZ;
      cylinder.rotation.x = Math.PI / 2;
      positionZ -= 5;
      
      this.group.add(cylinder);
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
    this.visualArray = this.spectrum.getVisualBins(this.dataArray, 32, 0, 1300);
    const avg = this.arrayAverage(this.visualArray);
    
    this.view.camera.rotation.z += (avg <= 1) ? 0 : Math.pow((avg / 8192) + 1, 2) - 1;
    
    if (this.group) {
      for (let i = 0; i < this.visualArray.length; i++) {
        this.setUniformColor(i, 308 - this.visualArray[i], parseInt(avg / 255 * 40) + 60, parseInt(this.visualArray[i] / 255 * 25) + 45, this.visualArray[i]);
        const scale = ((this.visualArray[i] / 255) * (avg / 255)) + 0.25;
        this.group.children[i].scale.x = scale;
        this.group.children[i].scale.y = scale;
        this.group.children[i].scale.z = scale;
      }
    }
  }

  setUniformColor(groupIndex, h, s, l, _factor) {
    this.group.children[groupIndex].material.uniforms.col.value = new THREE.Color(`hsl(${h}, ${s}%, ${l}%)`);
    this.group.children[groupIndex].material.uniforms.alpha.value = s / 100;
  }

  arrayAverage(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
    return sum / arr.length;
  }
}

export default {
  name: 'Tricentric',
  description: 'Rotating cylindrical visualization with dynamic scaling',
  class: Tricentric
}; 