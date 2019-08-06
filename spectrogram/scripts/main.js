window.onload = function(){
  var startButton = document.querySelector('.start');
  var colorChart = document.querySelector('.color-chart');
  console.dir(colorChart.clientWidth);
  var AudioContext = window.AudioContext || window.webkitAudioContext;
  var canvas = document.querySelector('.waterfall');
  var isPlaying = false;
  var spectrogram;
  var icon = document.querySelector('.icon');

  var canvasWidth = document.body.clientWidth - colorChart.clientWidth - 12;
  console.log(window);

  var canvasHeight = 512;

  canvas.width = canvasWidth;

  // let test = chroma.scale(['red','green']).domain(-140, 0);

  startButton.addEventListener('click', ()=>{
    if(!isPlaying){
      spectrogram = new Spectrogram(new AudioContext(), canvasWidth, canvasHeight);    
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
    canvas.width = document.body.clientWidth - colorChart.clientWidth - 12;
  }

  window.onresize = resizeCanvas;
}