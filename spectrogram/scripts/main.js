window.onload = function(){
  var startButton = document.querySelector('.start');
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var canvas = document.querySelector('.waterfall')

  // let test = chroma.scale(['red','green']).domain(-140, 0);

  startButton.addEventListener('click', ()=>{
    var spectrogram = new Spectrogram(new AudioContext());    
    spectrogram.start();
  })

  function resizeCanvas(){
    canvas.width = window.innerWidth;
  }

  window.onresize = resizeCanvas;
}