

class Spectrogram {
  constructor(audioContext, canvas){
    this.audioContext = audioContext;
    this._oscillatorNode = this.audioContext.createOscillator();
    this._analyser = this.audioContext.createAnalyser();
    this._analyser.fftSize = 4096;
    this._spectrographCanvas = canvas || document.querySelector('.waterfall')
    this._spectrographCanvasCtx = this._spectrographCanvas.getContext('2d');
    this._micSource = null;
    this._currentCol = 0;
    this._colorScale = chroma.scale(['#000326','green','#fff200','red','#660000']).domain([0,255]).mode('lrgb');
    // this.analyser.connect(this.audioContext.destination);
    this._oscillatorNode.connect(this._analyser);
    this._frameCounter = 0;
  }


  start(){
    this._spectrographCanvas.width = window.innerWidth;
    console.log('starting');
    // this._oscillatorNode.frequency.setValueAtTime(2000, this.audioContext.currentTime);
    // this._oscillatorNode.start();
    if(!this._micSource){
      this.connectMic();
    }
    this._animateSpectrogram();
  }

  connectMic(){
    
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
      let source = this.audioContext.createMediaStreamSource(stream);
      this._micSource = source;
      source.connect(this._analyser);
    })
  }

  stop(){
    
  }

  _init(){
    
  }


  _getFreqColor(data){
    return this._colorScale(data);
  }

  _draw(data){
    this._shiftWaterfall();
    this._addWaterFallCol(data);
    requestAnimationFrame(this._animateSpectrogram.bind(this));
  }

  _addWaterFallCol(data){
    for(let i = 0; i < data.length; i++){
      let currentColor = data[i]
      this._spectrographCanvasCtx.fillStyle = this._getFreqColor(currentColor)
      this._spectrographCanvasCtx.fillRect(0,i,1,1);
    }
  }
  _shiftWaterfall(){
    let waterfall = this._spectrographCanvasCtx.getImageData(0,0,this._spectrographCanvas.width,this._spectrographCanvas.height);
    this._spectrographCanvasCtx.clearRect(0,0, this._spectrographCanvas.width, this._spectrographCanvas.height);
    this._spectrographCanvasCtx.putImageData(waterfall, 1, 0);
  }

  _animateSpectrogram(){
    let dataArray = new Uint8Array(this._analyser.frequencyBinCount);
    this._analyser.getByteFrequencyData(dataArray);
    this._draw(dataArray);
  }
}