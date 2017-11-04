function highlightWords(speech, text, callback) {
  var arr = text.trim().split(' ');
  const OPEN_SPAN = '<span>';
  const CLOSE_SPAN = '</span>'
  var index = arr.indexOf(CLOSE_SPAN);
  if (index === -1) {
    arr.unshift(OPEN_SPAN, CLOSE_SPAN);
    index = 1;
  }
  var readArr = arr.splice(0, index + 1);
  var nextThree = arr.slice(0, 5).map(word => word.toLowerCase().replace(/\W/g, ''));
  var lastSpokenWord = speech.split(' ').splice(-1)[0];
  var foundIndex = nextThree.indexOf(lastSpokenWord.toLowerCase());
  if (foundIndex > -1) {
    var newlyRead = arr.splice(0, foundIndex + 1);
    readArr.splice(-1, 0, ...newlyRead);
    callback(readArr.concat(arr).join(" "));
  } else callback(null);
}

function populateWord(word, synonyms) {
  return `<span data-length="${synonyms.length}" data-synonyms="${synonyms}">${word}</span>`;
}

/**
 * Takes in user's text and list of potential stutters, and highlights and provides synonyms
 */
function optimizeScript(text, stutList, callback) {
  if (!stutList) return callback(text);
  else stutList = JSON.parse(stutList);

  stutList.sort((a, b) => a.index - b.index);
  text = text.split(" ");

  var count = 0;
  stutList.forEach(entry => {
    count++;
    text[entry.index] = populateWord(text[entry.index], entry.synonyms);
    if (count === stutList.length) {
      return callback(text.join(" "));
    }
  })
}
