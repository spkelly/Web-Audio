

class Spectrogram {
  constructor(audioContext, canvas){
    this.audioContext = audioContext;
    this._oscillatorNode = this.audioContext.createOscillator();
    this._analyser = this.audioContext.createAnalyser();
    this._analyser.fftSize = 2048;
    this._canvas = canvas || document.querySelector('.waterfall')
    this._canvasContext = this._canvas.getContext('2d');
    this._canvasContext.width = window.innerWidth;
    this._canvasContext.height = window.innerHeight;
    this._micSource = null;
    this._currentCol = 0;
    this._colorScale = chroma.scale(['red','yellow','green','blue']).domain([0.00, -140]);
    // this.analyser.connect(this.audioContext.destination);
    // this._oscillatorNode.connect(this._analyser);
  }

  start(){
    console.log('starting');
    // this._oscillatorNode.frequency.setValueAtTime(this.audioContext.currentTime);
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
    requestAnimationFrame(this._animateSpectrogram.bind(this));
    this._shiftWaterfall();
    this._addWaterFallCol(data);
  }

  _addWaterFallCol(data){
    for(let i = 0; i < data.length; i++){
      let currentColor = data[i]
      // if(currentColor > 220){
      //   this._canvasContext.fillStyle = `rgb(${currentColor},${currentColor},${currentColor})`;
      // }
      // else{
        
      // }
      this._canvasContext.fillStyle = this._getFreqColor(currentColor)
      this._canvasContext.fillRect(0,i,1,1);
    }
  }
  _shiftWaterfall(){
    let waterfall = this._canvasContext.getImageData(0,0,this._canvas.width,this._canvas.height);
    this._canvasContext.clearRect(0,0, this._canvas.width, this._canvas.height);
    this._canvasContext.putImageData(waterfall, 1, 0);
  }

  _animateSpectrogram(){
    let dataArray = new Float32Array(this._analyser.frequencyBinCount);
    this._analyser.getFloatFrequencyData(dataArray);
    this._draw(dataArray);
  }
}