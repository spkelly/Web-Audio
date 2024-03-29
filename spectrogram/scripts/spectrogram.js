

class Spectrogram {
  constructor(audioContext,width,height, canvas){
    this.audioContext = audioContext;
    this._isOn = false;
    this._oscillatorNode = this.audioContext.createOscillator();
    this._analyser = this.audioContext.createAnalyser();
    this._analyser.fftSize = 4096 *2;
    this._spectrographCanvas = canvas || document.querySelector('.waterfall');
    this._spectrographCanvas.width = width;
    this._spectrographCanvas.height = height;
    this._spectrographCanvasCtx = this._spectrographCanvas.getContext('2d');
    this._micSource = null;
    this._animationId = null;
    this._currentCol = 0;
    this._colorScale = chroma.scale(['#000326','green','#fff200','red','#660000']).domain([0,255]).mode('lrgb');
    // this.analyser.connect(this.audioContext.destination);
    this._oscillatorNode.connect(this._analyser);
    this._frameCounter = 0;
  }

  stop(){
    if(this._isOn){
      this._stopAudio();
      this._endAnimation();
      this._disconnectMic();
      this._isOn = false;
    }
    else{
      console.warn('the spectrogram is not playing');
    }
  }


  start(){
    if(!this._isOn){
      this._isOn = true;
    //       this._oscillatorNode.frequency.setValueAtTime(6000, this.audioContext.currentTime);
    // this._oscillatorNode.start();
      if(!this._micSource){
        this.connectMic();
      }
      this._animateSpectrogram();
    }
    else{
      console.warn('the spectrogram is already playing');
    }

  }

  connectMic(){
    navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
      let source = this.audioContext.createMediaStreamSource(stream);
      this._micSource = source;
      source.connect(this._analyser);
      console.log(this._micSource)
    })
  }
  
  _stopAudio(){
    let audioTracks = this._micSource.mediaStream.getTracks();
    audioTracks.map((track)=>{
      track.stop();
    })
  }
  
  _endAnimation(){
    cancelAnimationFrame(this._animationId);
    this._spectrographCanvasCtx.clearRect(0,0, this._spectrographCanvas.width, this._spectrographCanvas.height);
  }
  
  _disconnectMic(){
    this._micSource = null;
  }



  _getFreqColor(data){
    return this._colorScale(data)
  }

  _getColorChannel(data,channel){
    return this._colorScale(data).get(`rgb.${channel}`);
  }

  _draw(data){
    this._shiftWaterfall();
    this._addWaterFallCol(data);
    this._animationId = requestAnimationFrame(this._animateSpectrogram.bind(this));
  }

  _addWaterFallCol(data){

    let testImage = this._spectrographCanvasCtx.createImageData(1, 512);

    for(let i = 0; i< testImage.data.length; i += 4){
      testImage.data[i] = this._getColorChannel(data[i], 'r');
      testImage.data[i + 1] = this._getColorChannel(data[i], 'g');
      testImage.data[i + 2] = this._getColorChannel(data[i], 'b');
      testImage.data[i + 3] = 255;
    }

    this._spectrographCanvasCtx.putImageData(testImage,0,0)

    // for(let i = 0; i < data.length; i++){
    //   let currentColor = data[i]
    //   this._spectrographCanvasCtx.fillStyle = this._getFreqColor(currentColor)
    //   this._spectrographCanvasCtx.fillRect(0,i,1,1);
    // }
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