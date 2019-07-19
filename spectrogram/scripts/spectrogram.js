class Spectrogram {
  constructor(audioContext, canvas){
    // this.analyser.connect(this.audioContext.destination);
    this.audioContext = audioContext;
    this._oscillatorNode = this.audioContext.createOscillator();
    this._analyser = this.audioContext.createAnalyser();
    this._canvas = canvas || document.querySelector('.waterfall')
    this._canvasContext = this._canvas.getContext('2d');
    this._canvasContext.width = window.innerWidth;
    this._canvasContext.height = window.innerHeight;
    this._micSource = null;
    this._currentCol = 0;
    // this._oscillatorNode.connect(this._analyser);
  }

  start(){
    console.log('starting');
    this._oscillatorNode.frequency.setValueAtTime(1000, this.audioContext.currentTime);
    this._oscillatorNode.start();
    if(!this._micSource){
      this.connectMic();
    }
    console.log(this._micSource);
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

  _draw( data){
    requestAnimationFrame(this._animateSpectrogram.bind(this));
    let x = 0;
    let y = this._canvasContext.canvas.height /2;
    for(let i = 0; i < data.length; i++){
      let currentColor = data[i]
      this._canvasContext.fillStyle = `rgb(${currentColor},0,100)`
      this._canvasContext.fillRect(this._currentCol,i,2,2);
    }
   this._updateCol();
  }
  _shiftWaterfall(){
    let waterfall = this._canvasContext.getImageData(0,0,currentCol,this._canvas.height);
    this._canvasContext.clearRect(0,0, this._canvas.width, this._canvas.height);
    this._putImageData(waterfall, 2, 0);
  }

  _updateCol(){
    this._currentCol +=2;
    if(this._currentCol > this._canvas.width){
      this._currentCol = 0;
    };
  }

  _animateSpectrogram(){
    let dataArray = new Uint8Array(this._analyser.frequencyBinCount)
    this._analyser.getByteFrequencyData(dataArray);
    this._draw(dataArray);
  }
}