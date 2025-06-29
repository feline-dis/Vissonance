import * as THREE from 'three';

class HillFog {
  constructor() {
    this.name = 'Hill Fog';
    this.geometry = null;
    this.analyser = null;
    this.view = null;
    this.scene = null;
    this.plane = null;
    
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
    this.view.useOrthographicCamera();

    this.geometry = new THREE.PlaneGeometry(900, 40, 127);
    const uniforms = {};
    const material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader
    });
    
    this.plane = new THREE.Mesh(this.geometry, material);
    this.scene.add(this.plane);
  }

  destroy() {
    if (this.scene && this.plane) {
      this.scene.remove(this.plane);
    }
  }

  render() {
    if (!this.analyser || !this.geometry) return;
    
    this.analyser.fftSize = 256;
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteTimeDomainData(dataArray);
    
    if (this.geometry) {
      for (let i = 0; i < bufferLength; i++) {
        this.geometry.attributes.position.array[i * 3 + 1] = dataArray[i] / 3;
      }
      this.geometry.attributes.position.needsUpdate = true;
    }
  }
}

export default {
  name: 'Hill Fog',
  description: 'Waveform visualization creating a foggy hill effect',
  class: HillFog
}; 