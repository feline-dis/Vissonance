import * as THREE from 'three';
import Spectrum from '../lib/spectrum.js';

class Iris {
  constructor() {
    this.name = 'Iris';
    this.group = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.spectrum = null;
    
    this.bufferLength = 0;
    this.dataArray = null;
    this.visualArray = null;
    this.fsize = 4096;
    this.numBars = 128;
    
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
      '  gl_FragColor = vec4( -pos.z/180.0 * col.r, -pos.z/180.0 * col.g, -pos.z/180.0 * col.b, 1.0 );',
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
    this.view.camera.position.z = 250;

    for (let i = 0; i < this.numBars / 2; i++) {
      const uniforms = {
        col: { type: 'c', value: new THREE.Color('hsl(240, 100%, 50%)') },
      };
      
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader
      });

      // First plane
      let geometry = new THREE.PlaneGeometry(3, 500, 1);
      geometry.rotateX(Math.PI / 1.8);
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 60, 0));
      let plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = i * (Math.PI * 2 / this.numBars) + (Math.PI / this.numBars);
      this.group.add(plane);

      // Second plane (mirrored)
      geometry = new THREE.PlaneGeometry(3, 500, 1);
      geometry.rotateX(Math.PI / 1.8);
      geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 60, 0));
      plane = new THREE.Mesh(geometry, material);
      plane.rotation.z = -i * (Math.PI * 2 / this.numBars) - (Math.PI / this.numBars);
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
    const loudness = this.getLoudness(this.dataArray);
    this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numBars, 4, 1300);
    
    for (let i = 0; i < this.visualArray.length / 2; i++) {
      this.setUniformColor(i * 2, loudness);

      const heightValue = this.visualArray[i] / 2 + (65 + (loudness / 1.5));
      
      // Update first plane
      this.group.children[i * 2].geometry.attributes.position.array[7] = heightValue;
      this.group.children[i * 2].geometry.attributes.position.array[10] = heightValue;
      this.group.children[i * 2].geometry.attributes.position.needsUpdate = true;

      // Update second plane
      this.group.children[i * 2 + 1].geometry.attributes.position.array[7] = heightValue;
      this.group.children[i * 2 + 1].geometry.attributes.position.array[10] = heightValue;
      this.group.children[i * 2 + 1].geometry.attributes.position.needsUpdate = true;
    }
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
  name: 'Iris',
  description: 'Radial bars that pulse and change color with the music',
  class: Iris
}; 