declare class AudioAnalyser {
  audioCtx: AudioContext;
  analyser: AnalyserNode | null;
  gainNode: GainNode | null;
  source: AudioBufferSourceNode | null;
  audioNode: AudioNode | null;
  
  constructor(audioContext: AudioContext);
  
  init(): void;
  connect(audioNode: AudioNode): void;
  makeAudio(data: ArrayBuffer): void;
  playAudio(): void;
  setGain(value: number): void;
  destroy(): void;
}

export = AudioAnalyser; 