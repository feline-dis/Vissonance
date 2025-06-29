import * as THREE from 'three';
import Spectrum from '../lib/spectrum.js';

class Silk {
  constructor() {
    this.name = 'Silk';
    this.group = null;
    this.group2 = null;
    this.group3 = null;
    this.group4 = null;
    this.bgPlane = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.spectrum = null;
    
    this.bufferLength = 0;
    this.dataArray = null;
    this.visualArray = null;
    this.fsize = 4096;
    this.numBars = 512;
    this.barWidth = 10;
    this.barGap = 0.12;
    this.loudness = 0;
    this.lastLoudness = 0;
    
    this.vertexShader = [
      'void main() {',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',
      '}'
    ].join('\n');
    
    this.fragmentShader = [
      'uniform vec3 col;',
      'void main() {',
      '  gl_FragColor = vec4( col.r, col.g, col.b, 1.0 );',
      '}'
    ].join('\n');

    this.bgFragmentShader = [
      'void main() {',
      '  gl_FragColor = vec4( 1.0, 1.0, 1.0, 0.2 );',
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
    this.view.camera.position.x = 0;
    this.view.camera.position.y = 0;
    this.view.camera.position.z = 0;
    
    this.view.renderer.setClearColor(new THREE.Color(0xfdfdfd), 1);
    this.view.renderer.clear();
    this.view.renderer.autoClearColor = false;
    
    let posX = 3;
    
    for (let i = 0; i < this.numBars; i++) {
      const geometry = new THREE.CircleGeometry(10, 6);
      const uniforms = {
        col: { type: 'c', value: new THREE.Color('hsl(240, 100%, 50%)') },
      };
      
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: this.vertexShader,
        fragmentShader: this.fragmentShader,
        side: THREE.DoubleSide
      });
      
      const circle = new THREE.Mesh(geometry, material);
      circle.position.x = posX;
      circle.position.y = 0;
      circle.position.z = -50;
      posX += this.barGap;

      const pivot = new THREE.Object3D();
      pivot.add(circle);
      this.group.add(pivot);
    }
    
    this.scene.add(this.group);

    // Create mirrored groups
    this.group2 = this.group.clone();
    this.group2.rotation.z = Math.PI;
    this.scene.add(this.group2);

    this.group3 = this.group.clone();
    this.group3.rotation.z = Math.PI;
    this.scene.add(this.group3);

    this.group4 = this.group.clone();
    this.scene.add(this.group4);

    // Background plane
    const bgGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
    const bgMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: this.vertexShader,
      fragmentShader: this.bgFragmentShader,
      transparent: true,
      depthWrite: false
    });
    
    this.bgPlane = new THREE.Mesh(bgGeometry, bgMaterial);
    this.bgPlane.position.x = 0;
    this.bgPlane.position.y = 0;
    this.bgPlane.position.z = -60;
    this.scene.add(this.bgPlane);
  }

  destroy() {
    if (this.scene) {
      if (this.group) this.scene.remove(this.group);
      if (this.group2) this.scene.remove(this.group2);
      if (this.group3) this.scene.remove(this.group3);
      if (this.group4) this.scene.remove(this.group4);
      if (this.bgPlane) this.scene.remove(this.bgPlane);
    }
    
    if (this.view.renderer) {
      this.view.renderer.autoClearColor = true;
      this.view.renderer.setClearColor(new THREE.Color(0xffffff), 0);
      this.view.renderer.clear();
    }
  }

  reset() {
    if (this.group) {
      for (let i = 0; i < this.group.children.length; i++) {
        this.group.children[i].position.y = 0;
        this.group2.children[i].position.y = 0;
        this.group3.children[i].position.y = 0;
        this.group4.children[i].position.y = 0;
      }
    }
  }

  render() {
    if (!this.analyser || !this.group) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    this.visualArray = this.spectrum.getVisualBins(this.dataArray, this.numBars, 6, 1300);
    this.loudness = this.getLoudness(this.dataArray);
    
    // Smooth loudness
    this.loudness = (this.loudness + this.lastLoudness) / 2;
    
    if (this.group) {
      for (let i = 0; i < this.visualArray.length; i++) {
        this.setUniformColor(i, this.loudness);
        
        const yOffset = this.visualArray[i] / 5;
        this.group.children[i].position.y += yOffset;
        this.group2.children[i].position.y -= yOffset;
        this.group3.children[i].position.y -= yOffset;
        this.group4.children[i].position.y += yOffset;
      }
    }
    
    this.lastLoudness = this.loudness;
  }

  setUniformColor(groupIndex, loudness) {
    if (this.group.children[groupIndex] && this.group.children[groupIndex].children[0]) {
      const h = this.modn(250 - (loudness * 2.2), 360);
      const color = new THREE.Color(`hsl(${h}, 100%, 50%)`);
      
      this.group.children[groupIndex].children[0].material.uniforms.col.value = color;
      this.group2.children[groupIndex].children[0].material.uniforms.col.value = color;
      this.group3.children[groupIndex].children[0].material.uniforms.col.value = color;
      this.group4.children[groupIndex].children[0].material.uniforms.col.value = color;
    }
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
  name: 'Silk',
  description: 'Flowing circular patterns with silk-like movement',
  class: Silk
}; 