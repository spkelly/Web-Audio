class Visualizer {
  constructor(audioContext, inputNode){
    this.audioContext = audioContext;
    this.analyzerNode = this.audioContext.createAnalyser();
    this.volumeNode = this.audioContext.createGain();
    this.inputNode = inputNode;
    this.isPlaying = false;
    this.micMode = false;
    this._isMuted = false
    this._volume = 0.5;
  }

  play(){
    
  }

  toggleMute(){
    this._isMuted?
      this._setGain(0):
      this._setGain(this._volume);
    this._isMuted = !this._isMuted;
  }

  setVolume(volume){
    this._setGain(volume);
    this._volume = volume;
  }

  getAnalyserByteTime(targetArray){
    return this.analyzerNode.getByteTimeDomainData(targetArray)
  }

  _setGain(volume){
    
  }
}

