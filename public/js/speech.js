window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

function performHighlighting(speech) {
  const text = document.querySelector('.words');
  if (!text) return;

  // const stutterWord = text.querySelector('.stutter');

  highlightWords(speech, text.innerHTML, (res, spanPos) => {
    if (res) {
      text.innerHTML = res;
      updateStutList(spanPos);
    }
  });
}

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript).join('');

    console.log(transcript);
    performHighlighting(transcript);

    if (transcript.includes('background') && transcript.includes('change')){
      console.log("Changing background colour...");
      const r = Math.round(Math.random() * 255);
      const g = (transcript.includes('td')) ? 255 : Math.round(Math.random() * 255);
      const b = Math.round(Math.random() * 255);

      console.log(r,g,b);

      document.body.style.backgroundColor = `rgb(${r},${g},${b})`;
    }
});

function startSpeechRecognition() {
  recognition.addEventListener('end', recognition.start);

  recognition.start();
}

function stopSpeechRecognition() {
  recognition.removeEventListener('end', recognition.start);
  recognition.stop();
}
