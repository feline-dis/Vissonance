class AudioAnalyser {
  constructor(audioContext) {
    this.audioCtx = audioContext;
    this.analyser = null;
    this.gainNode = null;
    this.source = null;
    this.audioNode = null;
    
    this.init();
  }

  init() {
    this.analyser = this.audioCtx.createAnalyser();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 0.2;
    
    // Connect gain to destination
    this.gainNode.connect(this.audioCtx.destination);
  }

  connect(audioNode) {
    // Disconnect previous audio node if exists
    if (this.audioNode) {
      this.audioNode.disconnect(this.analyser);
      this.audioNode.disconnect(this.gainNode);
    }

    this.audioNode = audioNode;
    
    // Connect the audio node to analyser and gain
    this.audioNode.connect(this.analyser);
    this.audioNode.connect(this.gainNode);
  }

  // Method to create audio from buffer (for backward compatibility)
  makeAudio(data) {
    if (this.source) {
      this.source.stop(0);
    }

    this.source = this.audioCtx.createBufferSource();

    if (this.audioCtx.decodeAudioData) {
      this.audioCtx.decodeAudioData(data, (buffer) => {
        this.source.buffer = buffer;
        this.playAudio();
      });
    } else {
      this.source.buffer = this.audioCtx.createBuffer(data, false);
      this.playAudio();
    }
  }

  playAudio() {
    this.source.connect(this.analyser);
    this.source.connect(this.gainNode);
    this.source.start(0);
  }

  setGain(value) {
    if (this.gainNode) {
      this.gainNode.gain.value = value;
    }
  }

  destroy() {
    if (this.source) {
      this.source.stop(0);
      this.source.disconnect();
    }
    if (this.audioNode) {
      this.audioNode.disconnect();
    }
    if (this.analyser) {
      this.analyser.disconnect();
    }
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
  }
}

export default AudioAnalyser; 