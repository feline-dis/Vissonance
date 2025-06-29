import * as THREE from 'three';
import Spectrum from '../lib/spectrum.js';

class Siphon {
  constructor() {
    this.name = 'Siphon';
    this.group = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.spectrum = null;
    
    this.bufferLength = 0;
    this.dataArray = null;
    this.visualArray = null;
    this.fsize = 4096;
    this.numBands = 36;
    this.numBars = 128;
    this.barLen = 10;
    this.barGap = 8;
    this.currentBand = 0;
    this.v = this.numBars * 3 * 2 * 2;
    this.lastLoudness = 0;
    this.cylRadius = 100;
    
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
      '  gl_FragColor = vec4( col.r, col.g, col.b, 1.0 );',
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
    this.view.camera.position.z = 0;

    this.view.renderer.autoClearColor = true;
    this.view.renderer.setClearColor(new THREE.Color('hsl(0, 0%, 100%)'), 1);

    let posX = 0;

    for (let i = 0; i < this.numBands; i++) {
      const geometry = new THREE.CylinderGeometry(this.cylRadius, this.cylRadius, this.barLen, (this.numBars * 2) - 1, 1, true);
      const uniforms = {
        col: { type: 'c', value: new THREE.Color('hsl(240, 100%, 50%)') },
      };
      
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        side: THREE.BackSide
      });
      
      const cylinder = new THREE.Mesh(geometry, material);
      cylinder.rotation.z = Math.PI / 2;
      cylinder.rotation.y = Math.PI / 2;
      cylinder.position.z = posX;
      posX -= this.barGap;

      this.group.add(cylinder);
    }
    
    this.group.rotation.z = -Math.PI / 2;
    this.scene.add(this.group);
  }

  destroy() {
    if (this.scene && this.group) {
      this.scene.remove(this.group);
    }
    if (this.view.renderer) {
      this.view.renderer.autoClearColor = false;
    }
  }

  render() {
    if (!this.analyser || !this.group) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numBars, 4, 1300);
    const loudness = this.getLoudness(this.dataArray);
    
    // Smooth loudness (prepared for future features)
    const _smoothLoudness = (loudness + this.lastLoudness) / 2; // eslint-disable-line no-unused-vars
    
    if (this.group) {
      const scale = 1 - Math.min(loudness / 255, 0.80);
      this.group.scale.x = scale;
      this.group.scale.y = scale;
      
      for (let c = 0; c < this.group.children.length; c++) {
        const zMovement = (loudness <= 1) ? 0 : (Math.pow((loudness / 8192) + 1, 2) - 1) * loudness * 4;
        this.group.children[c].position.z += zMovement;
        
        // Reset position when out of sight
        if (this.group.children[c].position.z > 10) {
          this.group.children[c].position.z -= this.numBands * this.barGap;
          this.currentBand = c;
        }
      }
      
      // Update geometry based on visualArray
      for (let i = 0; i < this.visualArray.length; i++) {
        this.scaleGroupVectorLength(this.currentBand, i * 3 + (this.numBars * 6), -this.visualArray[i] / 3.5 - (loudness / 7));
        this.scaleGroupVectorLength(this.currentBand, (this.v / 2 - 3) - ((this.numBars * 3) + (i * 3)) + (this.numBars * 3) + (this.numBars * 6), -this.visualArray[i] / 3.5 - (loudness / 7));
        this.group.children[this.currentBand].geometry.attributes.position.needsUpdate = true;
      }
      
      this.setUniformColor(this.currentBand, loudness);
    }
    
    this.lastLoudness = loudness;
  }

  scaleGroupVectorLength(groupC, groupI, length) {
    const v3 = new THREE.Vector3(
      this.group.children[groupC].geometry.attributes.position.array[groupI + 0],
      this.group.children[groupC].geometry.attributes.position.array[groupI + 1],
      this.group.children[groupC].geometry.attributes.position.array[groupI + 2]
    );
    
    const scalar = (length + this.cylRadius) / v3.distanceTo(new THREE.Vector3(0, 0, 0));

    this.group.children[groupC].geometry.attributes.position.array[groupI + 0] *= scalar;
    this.group.children[groupC].geometry.attributes.position.array[groupI + 1] *= scalar;
    this.group.children[groupC].geometry.attributes.position.array[groupI + 2] *= scalar;
  }

  setUniformColor(groupIndex, loudness) {
    const h = this.modn(250 - (loudness * 7), 360);
    this.group.children[groupIndex].material.uniforms.col.value = new THREE.Color(`hsl(${h}, 100%, 50%)`);
    this.view.renderer.setClearColor(new THREE.Color(`hsl(${(h + 180) % 360}, 100%, 97%)`), 1);
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
  name: 'Siphon',
  description: 'Tubular visualization with dynamic scaling and color effects',
  class: Siphon
}; 