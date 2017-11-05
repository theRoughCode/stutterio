// function splitText(text, callback) {
//   var arr = text.trim().split(' ');
//   var counter = 0;
//   for (var i = arr.length - 1; i >= 0; i--) {
//     if ((arr[i].includes('<') || arr[i].includes('='))) {
//       if (i < arr.length - 1) arr[i + 1] = arr[i].concat(arr[i+1]);
//       else arr[i - 1] = arr[i - 1].concat(arr[i]);
//       arr.splice(i, 1);
//     } else if (arr[i].includes('>')) {
//       if (i > 0) arr[i - 1] = arr[i - 1].concat(arr[i]);
//       else arr[i + 1] = arr[i].concat(arr[i + 1]);
//       arr.splice(i, 1);
//     }
//     counter++;
//     if (counter >= arr.length) return callback(arr);
//   }
// }

function highlightWords(speech, text, callback) {
  console.log(text);
  const ARR_LIMIT = (text.includes('<a class="stutter"')) ? 10 : 5;

  var arr = text.trim().split(' ');
  const OPEN_SPAN = '<span>';
  const CLOSE_SPAN = '</span>'
  var index = arr.indexOf(CLOSE_SPAN);
  if (index === -1) {
    arr.unshift(OPEN_SPAN, CLOSE_SPAN);
    index = 1;
  }
  var readArr = arr.splice(0, index + 1);
  var nextFew = arr.slice(0, ARR_LIMIT).map(word => word.toLowerCase().replace(/\W/g, ''));
  var lastSpokenWord = speech.split(' ').splice(-1)[0].replace(/\W/g, '');
  var foundIndex = nextFew.indexOf(lastSpokenWord.toLowerCase());
  console.log(nextFew);
  if (foundIndex > -1) {
    var newlyRead = arr.splice(0, foundIndex + 1);
    readArr.splice(-1, 0, ...newlyRead);
    callback(readArr.concat(arr).join(" "));
  } else callback(null);
}

// function parseStutterWord(word, callback) {
//   var startIndex = word.indexOf('>') + 1;
//   var endIndex = word.indexOf('<', startIndex);
//   callback(word.slice(startIndex, endIndex));
// }

function populateWord(word, synonyms) {
  return `<a class="stutter" data-length="${synonyms.length}" data-synonyms="${synonyms}">${word}</a>`;
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
