const recordButton = document.querySelector('#record-btn');
var isRecording = false;
var recordRTC = null, audio = null;

function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

function startRecording() {
  recordRTC.startRecording();
  recordButton.innerHTML = 'Stop';
  isRecording = true;
}

function stopRecording() {
  recordRTC.stopRecording(function(audioURL) {
      var recordedBlob = this.getBlob();

      document.querySelector('#audio').src = audioURL;

      recordRTC.getDataURL(function(dataURL) {
        // create a new request and send it via the objectUrl
        var request = new XMLHttpRequest();
        request.open("POST", './audio', true);
        request.responseType = "text";
        request.setRequestHeader("Content-type", "application/json");
        request.onload = function(e){
          // send the blob somewhere else or handle it here
          // use request.response
          console.log("Server returned: ",e.target.responseText);
        };
        request.send(JSON.stringify({ url: dataURL}));
        recordButton.innerHTML = 'Record';
        isRecording = false;
      });
  });
}

function successCallback(audioStream) {
  // RecordRTC usage goes here
  recordRTC = RecordRTC(audioStream, {
    type: 'audio',
    recorderType: StereoAudioRecorder,
    mimeType: 'audio/mp3'
  });
}

var errorCallback = function(e) {
  console.log('Reeeejected!', e);
};

if (hasGetUserMedia()) {
  // Good to go!
  // Not showing vendor prefixes.
  navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(successCallback).catch(errorCallback);
} else {
  alert('getUserMedia() is not supported in your browser');
}


function handleClick() {
  if (isRecording) stopRecording();
  else startRecording();
}
