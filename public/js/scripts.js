var isRecording = false;
var recordRTC = null, audio = null;

/**
 * Gets cookie of key cname
 */
function getCookie(cname, callback) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var startIndex = decodedCookie.indexOf(cname) + name.length;
  var endIndex = decodedCookie.indexOf(';', startIndex);
  var cookieVal = '';
  if (endIndex === -1) cookieVal = decodedCookie.substring(startIndex);
  else cookieVal = decodedCookie.substring(startIndex, endIndex);
  callback(cookieVal)
}

/**
 * Check if user is logged in
 */
 function checkUserLoggedIn(callback) {
   getCookie('user', user => {
     if(user !== null && user.length) {
       user = JSON.parse(user);

      var request = new XMLHttpRequest();
      request.open("POST", './createUser', true);
      request.responseType = "text";
      request.setRequestHeader("Content-type", "application/json");
      request.onload = function(e){
        // console.log("Server returned: ", e.target.responseText);
      };
      request.send(JSON.stringify({
        id: user.id,
        name: user.name
      }));
       callback(true);
     } else callback(false);
   });
 }

/**
 * Returns true if user has media to record audio
 */
function hasGetUserMedia() {
  return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia || navigator.msGetUserMedia);
}

/**
 * Start listenting to audio input
 */
function startRecording() {
  recordRTC.startRecording();
  isRecording = true;
}

/**
 * Stop recording and get mp3 file
 */
function stopRecording() {
  recordRTC.stopRecording(function(audioURL) {
      // var recordedBlob = this.getBlob();

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
          // console.log("Server returned: ", e.target.responseText);
          recordRTC.clearRecordedData();
        };
        request.send(JSON.stringify({ url: dataURL}));
        isRecording = false;
      });
  });
}

/**
 * Event listener for record button
 */
function handleRecord() {
  const recordButton = document.querySelector('#record-btn').querySelector('i');
  recordButton.classList.toggle('fa-microphone');
  recordButton.classList.toggle('fa-microphone-slash');
  if (isRecording) {
    stopRecording();
  } else {
    startRecording();
    startSpeechRecognition();
  }
}

/**
 * Event listener for subnit button
 */
function handleSubmit() {
  const script = document.querySelector('.input-body').value;
  var request = new XMLHttpRequest();
  request.open("POST", './highlightStutters', true);
  request.responseType = "text";
  request.setRequestHeader("Content-type", "application/json");
  request.onload = function(e){
    // send the blob somewhere else or handle it here
    // use request.response
    optimizeScript(script, request.response, optimized => swapTemplates(INTRO_SCREEN_TEMPLATE, { text: optimized }));
  };

  getCookie('user', user => {
    if(user !== null && user.length) {
      user = JSON.parse(user);
      request.send(JSON.stringify({
        user: user.id,
        text: script
      }));
    }
  });

  swapTemplates(LOADING_SCREEN);
}


checkUserLoggedIn(success => {
  if (success) {
    swapTemplates(INPUT_SCRIPT_TEMPLATE);
    var successCallback = function(audioStream) {
      // RecordRTC usage goes here
      recordRTC = RecordRTC(audioStream, {
        type: 'audio',
        recorderType: StereoAudioRecorder,
        mimeType: 'audio/mp3',
        sampleRate: 44100,
        bufferSize: 16384
      });
    };
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
  } else window.location = '/';
});
