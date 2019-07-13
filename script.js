(()=>{
  let analyzer;
  let ac;
  let canvas = document.querySelector('.visualizer');
  let logButton = document.querySelector('.log__button');
  let micIndicator = document.querySelector('.mic_indicator');
  let startButton = document.querySelector('#click-me');
  let ctx = canvas.getContext("2d");
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const BACKGROUND_COLOR = '#1b283d';


  console.log(micIndicator);


  let globalStream;
  let animation;

  let playAnimation = false;

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


  ac = new AudioContext();
  analyzer = ac.createAnalyser();

  startButton.addEventListener('click',function(){


    if(settings.micEnabled){
      stopStream();
      updateDisplay();
      playAnimation = false;
    }
    else{
      ac.resume().then(async()=>{
        let source = await getMicSource();
        settings.micEnabled = true;
        connectAudioNodes(source, analyzer);
        // outputs sound to speakers
        // connectAudioNodes(source,analyzer,ac.destination);
        updateDisplay();
        vizualizeWaveform(); 
      })
    }

    async function getMicSource(){
      return new Promise((resolve,reject)=>{
        if(navigator.mediaDevices){
          navigator.mediaDevices.getUserMedia({audio:true}).then((stream)=>{
            let source = ac.createMediaStreamSource(stream);
            globalStream = stream;
            resolve(source);
          })
          .catch((e)=>{
            console.log(e.message)
          })
        }
      })
    }

    function connectAudioNodes(...nodes){
      nodes.forEach((node, currentIndex, nodes)=>{
        if(currentIndex != nodes.length - 1){
          node.connect(nodes[currentIndex + 1])
        }
        else{
          console.log('on the last index')
        }
      })
    }


    function vizualizeWaveform(){
      analyzer.fftSize = 1024;
      playAnimation = true;
      var bufferLength = analyzer.fftSize;
      var dataArray = new Uint8Array(bufferLength);
      
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      
      
      let animateWaveform = function(){
        if(playAnimation){
          requestAnimationFrame(animateWaveform);
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
  
            globalX = x;
            globalY = y;
            globalV = v;
  
  
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
      }


      animateWaveform();
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
   resetCanvas();
  }

  function resetCanvas(){
    if(ctx){
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
      ctx.beginPath();
      ctx.moveTo(0, HEIGHT/2);
      ctx.lineTo(WIDTH, HEIGHT/2);
      ctx.stroke();
    }
    else{
      ctx = document.querySelector(".visualizer").getContext('2d')
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }
  }

  function updateDisplay(){
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
