(()=>{
  
  let analyzer;
  let ac;
  let canvas = document.querySelector('.visualizer');
  let logButton = document.querySelector('.log__button');
  let micIndicator = document.querySelector('.mic_indicator');
  let startButton = document.querySelector('#click-me');
  let ctx = canvas.getContext("2d");

  console.log(micIndicator);


  let globalStream;
  let animation;

  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const BACKGROUND_COLOR = '#1b283d';

  let settings = {
    micEnabled:false,
    outputSound:false,
    fft: 2048,
    lineColor:'#73a3f0',
    lineWidth: 2
  }

  initCanvas();
  updateDisplay();

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const constraints = {audio:true};
  ac = new AudioContext();
  analyzer = ac.createAnalyser();

  startButton.addEventListener('click',function(){


    if(settings.micEnabled){
      stopStream();
      updateDisplay();
      console.log(settings);
    }
    else{
      
      ac.resume().then(()=>{
        console.log('starting audio context');
        if(navigator.mediaDevices){
          navigator.mediaDevices.getUserMedia(constraints)
          .then((stream)=>{
            settings.micEnabled = true;
            updateDisplay();
            console.log(settings);
            globalStream = stream;
            var source = ac.createMediaStreamSource(stream);
            source.connect(analyzer);
            if(settings.outputSound){
              analyzer.connect(ac.destination);
            }

            vizualizeWaveform();
          })
          .catch((e)=>{
            console.log('an error occured', e.message)
          });
        }
       
      })
    }


    function vizualizeWaveform(){
      analyzer.fftSize = 1024;
      var bufferLength = analyzer.fftSize;
      console.log(bufferLength);
      var dataArray = new Uint8Array(bufferLength);
      
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      
      
      let drawWaveForm = function(){
        animation = requestAnimationFrame(drawWaveForm);
        analyzer.getByteTimeDomainData(dataArray);
        ctx.fillStyle =  BACKGROUND_COLOR;
        ctx.fillRect(0, 0,WIDTH, HEIGHT);

        ctx.lineWidth = settings.lineWidth;
        ctx.strokeStyle = settings.lineColor;

        ctx.beginPath();
        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;
        for(var i = 0; i < bufferLength; i++) {

          var v = dataArray[i] / 128.0;
          var y = v * HEIGHT/2;

          // For Debugging purposes
          // globalX = x;
          // globalY = y;
          // globalV = v;


          if(i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(WIDTH, HEIGHT/2);
        ctx.stroke();
      }


      drawWaveForm();
    }
    
  });

  // used to debug certain variables in the callback function
  logButton.addEventListener('click',()=>{
    console.table({
      'global X': globalX,
      'global Y': globalY,
      'global V': globalV,
      'globalStream': globalStream
    })
  })


  function stopStream(){
   globalStream.getTracks().forEach((track)=>{
     track.stop();
   })
   settings.micEnabled = false;
   clearCanvas();
  }

  function clearCanvas(){
    if(ctx){
      ctx.fillRect(0, 0,WIDTH, HEIGHT);
    }
    else{
      ctx = document.querySelector(".visualizer").getContext('2d')
      ctx.fillRect(0, 0,WIDTH, HEIGHT);
    }
  }

  function updateDisplay(){
    console.log('here', settings);
    micIndicator.textContent = settings.micEnabled?'enabled':'disabled';
    micIndicator.style.color = settings.micEnabled?'green':'red';
  }


  function initCanvas(){
    ctx.fillStyle =  BACKGROUND_COLOR;
    ctx.lineWidth = settings.lineWidth;
    ctx.strokeStyle = settings.lineColor;
    ctx.beginPath();
    ctx.moveTo(0, HEIGHT/2);
    ctx.lineTo(WIDTH, HEIGHT/2);
    ctx.stroke();
  }

})();
