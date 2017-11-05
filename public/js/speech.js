window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;

function performHighlighting(speech) {
  const text = document.querySelector('.words');
  if (!text) return;

  // const stutterWord = text.querySelector('.stutter');

  highlightWords(speech, text.innerHTML, (res, spanPos, maxWords) => {
    if (res) {
      text.innerHTML = res;
      updateStutList(spanPos);
      var percentage = 0;
      // If end of text
      if (res.indexOf('</span>') + '</span>'.length >= res.length) {
        percentage = 100;
        swapTemplates(LOADING_SCREEN, { text: 'Personalizing info...' });
        setTimeout(() => swapTemplates(INPUT_SCRIPT_TEMPLATE), 3000);
        handleRecord();
      } else if (maxWords) percentage = Math.round(spanPos * 100 / maxWords);

      const progressBar = document.querySelector('.w3-green');
      if(progressBar) progressBar.style.width = `${percentage}%`;
    }
  });
}

recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript).join('');

    // console.log(transcript);
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
