window.onload = function(){
  var startButton = document.querySelector('.start');
  var AudioContext = window.AudioContext || window.webkitAudioContext;


  // let test = chroma.scale(['red','green']).domain(-140, 0);

  startButton.addEventListener('click', ()=>{
    var spectrogram = new Spectrogram(new AudioContext());    
    spectrogram.start();
  })
}