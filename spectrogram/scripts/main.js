window.onload = function(){
  var startButton = document.querySelector('.start');
  var AudioContext = window.AudioContext || window.webkitAudioContext;

  startButton.addEventListener('click', ()=>{
    var spectrogram = new Spectrogram(new AudioContext());    
    spectrogram.start();
  })
}