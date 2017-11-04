function getDefaultText(callback) {
  const text = "I have four cats and five dogs."

  callback(text);
}

var unirest = require('unirest');

/*
 * Consumes a user id and his sample entry and finds every occurance of a stutter in his
 * sample, then adds the stutter causing syllable to the user's list of stuttering
 * syllables.
 */
function findStuttersyllables(words, user){
	for(var word in words){
		//find the first syllable of the word using the words api
		//add the first syllable to the user list of syllables
	}
}

/*
 * Consumes in a word and returns the first syllable of the word using words api
 */
function firstsyllable(word){
	var request = "https://wordsapiv1.p.mashape.com/words/" + word
	unirest.get(request)
  .header("X-Mashape-Key", "uzoBeHZ3TkmshlrZiPD8eWLQQZF9p1sRnxJjsnMzgqCMQB9Xnh")
  .header("Accept", "application/json")
  .end(function (result) {
    var parsedWord = JSON.parse(result.body);
    var syllables = JSON.parse(parsedWord.syllables).list;
    return syllables[0];
	});
}
/*
 * Consumes a user id and a piece of text and returns the text after highlighting each word
 * that starts with one of the user's stuttering syllables.
 */
function listOfStutterWords(text, user){
   // go through the text word by word
   // if words starts with one of the user's stuttering syllables
   // highlight word by adding tags before and after it
}
module.exports = {
  findStuttersyllables
  getDefaultText
}
