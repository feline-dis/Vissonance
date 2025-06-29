declare class Spectrum {
  spectrumDimensionScalar: number;
  spectrumMaxExponent: number;
  spectrumMinExponent: number;
  spectrumExponentScale: number;
  spectrumHeight: number;
  
  constructor();
  
  getVisualBins(
    dataArray: Uint8Array, 
    numElements: number, 
    spectrumStart: number, 
    spectrumEnd: number
  ): number[];
  exponentialTransform(array: number[]): number[];
  spectrumEase(v: number): number;
}

export = Spectrum; 