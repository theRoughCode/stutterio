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
