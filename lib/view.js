import * as THREE from 'three';

class View {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.options = options;
    
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.renderVisualization = null;
    
    this.init();
  }

  init() {
    // Create scene
    this.scene = new THREE.Scene();
    
    // Create camera (default to orthographic)
    this.useOrthographicCamera();
    
    // Create renderer with provided canvas
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: this.canvas,
      alpha: true, 
      preserveDrawingBuffer: true 
    });
    
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    this.setSize(this.options.width, this.options.height);
    
    // Set up resize handler if in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }
  }

  usePerspectiveCamera() {
    const aspect = this.options.width / this.options.height;
    this.camera = new THREE.PerspectiveCamera(70, aspect, 0.01, 2000);
    this.camera.position.y = 150;
    this.camera.position.z = 500;
  }

  useOrthographicCamera() {
    const halfWidth = this.options.width / 2;
    const halfHeight = this.options.height / 2;
    this.camera = new THREE.OrthographicCamera(-halfWidth, halfWidth, halfHeight, -halfHeight, 1, 1000);
    this.camera.position.y = 150;
    this.camera.position.z = 500;
  }

  setSize(width, height) {
    this.options.width = width;
    this.options.height = height;
    
    if (this.renderer) {
      this.renderer.setSize(width, height);
    }
    
    if (this.camera) {
      if (this.camera.isPerspectiveCamera) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
      } else if (this.camera.isOrthographicCamera) {
        const halfWidth = width / 2;
        const halfHeight = height / 2;
        this.camera.left = -halfWidth;
        this.camera.right = halfWidth;
        this.camera.top = halfHeight;
        this.camera.bottom = -halfHeight;
        this.camera.updateProjectionMatrix();
      }
    }
  }

  onWindowResize() {
    // Only auto-resize if canvas is full window
    if (this.canvas.width === window.innerWidth && this.canvas.height === window.innerHeight) {
      this.setSize(window.innerWidth, window.innerHeight);
    }
  }

  setRenderFunction(renderFunction) {
    this.renderVisualization = renderFunction;
  }

  render() {
    if (this.renderVisualization) {
      this.renderVisualization();
    }
    
    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
    
    if (this.renderer) {
      this.renderer.dispose();
    }
    
    if (this.scene) {
      // Clean up scene objects
      while (this.scene.children.length > 0) {
        const child = this.scene.children[0];
        this.scene.remove(child);
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          } else {
            child.material.dispose();
          }
        }
      }
    }
  }
}

export default View; 