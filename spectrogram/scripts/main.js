window.onload = function(){
  var startButton = document.querySelector('.start');
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var canvas = document.querySelector('.waterfall');
  var isPlaying = false;
  var spectrogram;
  var icon = document.querySelector('.icon');

  // let test = chroma.scale(['red','green']).domain(-140, 0);

  startButton.addEventListener('click', ()=>{
    if(!isPlaying){
      spectrogram = new Spectrogram(new AudioContext());    
      spectrogram.start();
      isPlaying = true;
      icon.textContent = 'stop';
    }
    else{
      spectrogram.stop();
      isPlaying = false;
      icon.textContent = 'play_arrow'
    }
  })

  function resizeCanvas(){
    canvas.width = window.innerWidth;
  }

  window.onresize = resizeCanvas;
}