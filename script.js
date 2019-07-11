(()=>{
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const constraints = {audio:true};
  
  document.querySelector('button').addEventListener('click',function(){
    const ac = new AudioContext();
    ac.resume().then(()=>{
      console.log('starting audio context');
      if(navigator.mediaDevices){
        const mic = navigator.mediaDevices.getUserMedia(constraints)
        .then((stream)=>{
        var source = ac.createMediaStreamSource(stream);
        source.connect(ac.destination);
        })
        .catch((e)=>{console.dir(e)});
      }
    })
  });
})();