class Spectrum {
  constructor() {
    this.spectrumDimensionScalar = 4.5;
    this.spectrumMaxExponent = 5;
    this.spectrumMinExponent = 3;
    this.spectrumExponentScale = 2;
    this.spectrumHeight = 255;
  }

  getVisualBins(dataArray, numElements, spectrumStart, spectrumEnd) {
    const spectrumBarCount = numElements;
    const samplePoints = [];
    const newArray = [];
    let lastSpot = 0;

    // Calculate sample points
    for (let i = 0; i < spectrumBarCount; i++) {
      let bin = Math.round(this.spectrumEase(i / spectrumBarCount) * (spectrumEnd - spectrumStart) + spectrumStart);
      if (bin <= lastSpot) {
        bin = lastSpot + 1;
      }
      lastSpot = bin;
      samplePoints[i] = bin;
    }

    // Find maximum sample points
    const maxSamplePoints = [];
    for (let i = 0; i < spectrumBarCount; i++) {
      const curSpot = samplePoints[i];
      let nextSpot = samplePoints[i + 1];
      if (nextSpot == null) {
        nextSpot = spectrumEnd;
      }

      let curMax = dataArray[curSpot];
      let maxSpot = curSpot;
      const dif = nextSpot - curSpot;
      
      for (let j = 1; j < dif; j++) {
        const newSpot = curSpot + j;
        if (dataArray[newSpot] > curMax) {
          curMax = dataArray[newSpot];
          maxSpot = newSpot;
        }
      }
      maxSamplePoints[i] = maxSpot;
    }

    // Calculate averaged values
    for (let i = 0; i < spectrumBarCount; i++) {
      const nextMaxSpot = maxSamplePoints[i];
      let lastMaxSpot = maxSamplePoints[i - 1];
      if (lastMaxSpot == null) {
        lastMaxSpot = spectrumStart;
      }
      
      const lastMax = dataArray[lastMaxSpot];
      const nextMax = dataArray[nextMaxSpot];

      newArray[i] = (lastMax + nextMax) / 2;
      if (isNaN(newArray[i])) {
        newArray[i] = 0;
      }
    }
    
    return this.exponentialTransform(newArray);
  }

  exponentialTransform(array) {
    const newArr = [];
    for (let i = 0; i < array.length; i++) {
      const exp = this.spectrumMaxExponent + (this.spectrumMinExponent - this.spectrumMaxExponent) * (i / array.length);
      newArr[i] = Math.max(Math.pow(array[i] / this.spectrumHeight, exp) * this.spectrumHeight, 1);
    }
    return newArr;
  }

  spectrumEase(v) {
    return Math.pow(v, 2.55);
  }
}

export default Spectrum; 