import AudioAnalyser from './audio-analyser.js';
import View from './view.js';

class Vissonance {
  constructor(audioContext, canvas, options = {}) {
    this.audioContext = audioContext;
    this.canvas = canvas;
    this.options = {
      width: options.width || canvas.width || 800,
      height: options.height || canvas.height || 600,
      ...options
    };
    
    this.audioAnalyser = null;
    this.view = null;
    this.currentPreset = null;
    this.animationId = null;
    this.isInitialized = false;
    
    this.init();
  }

  init() {
    // Initialize audio analyser
    this.audioAnalyser = new AudioAnalyser(this.audioContext);
    
    // Initialize view with canvas
    this.view = new View(this.canvas, this.options);
    
    this.isInitialized = true;
    this.startRenderLoop();
  }

  connectAudio(audioNode) {
    if (!this.isInitialized) {
      throw new Error('Vissonance not initialized');
    }
    this.audioAnalyser.connect(audioNode);
  }

  loadPreset(preset, _blendTime = 0.0) {
    if (!this.isInitialized) {
      throw new Error('Vissonance not initialized');
    }

    // Destroy current preset if exists
    if (this.currentPreset && this.currentPreset.destroy) {
      this.currentPreset.destroy();
    }

    // Create new preset instance
    this.currentPreset = new preset.class();
    this.currentPreset.init(this.audioAnalyser, this.view);
    this.currentPreset.make();
    
    // Set render function
    this.view.setRenderFunction(this.currentPreset.render.bind(this.currentPreset));
  }

  setRendererSize(width, height) {
    if (!this.isInitialized) {
      throw new Error('Vissonance not initialized');
    }
    this.options.width = width;
    this.options.height = height;
    this.view.setSize(width, height);
  }

  render() {
    if (!this.isInitialized) {
      return;
    }
    this.view.render();
  }

  startRenderLoop() {
    const animate = () => {
      this.animationId = requestAnimationFrame(animate);
      this.render();
    };
    animate();
  }

  stopRenderLoop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  destroy() {
    this.stopRenderLoop();
    
    if (this.currentPreset && this.currentPreset.destroy) {
      this.currentPreset.destroy();
    }
    
    if (this.view) {
      this.view.destroy();
    }
    
    if (this.audioAnalyser) {
      this.audioAnalyser.destroy();
    }
    
    this.isInitialized = false;
  }
}

// Static method to create visualizer (similar to Butterchurn API)
Vissonance.createVisualizer = function(audioContext, canvas, options) {
  return new Vissonance(audioContext, canvas, options);
};

export default Vissonance; 