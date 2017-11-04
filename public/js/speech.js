window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

function performHighlighting(speech) {
  const text = document.querySelector('.words');
  if (!text) return;

  highlightWords(speech, text.innerHTML, res => {
    if (res) text.innerHTML = res;
  });
}

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript).join('');

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

recognition.addEventListener('end', recognition.start);

recognition.start();