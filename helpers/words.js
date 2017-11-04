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
function firstSyllable(word, callback){
	var request = "https://wordsapiv1.p.mashape.com/words/" + word + "/syllables"
	unirest.get(request)
  .header("X-Mashape-Key", "Q1wnEQpmtsmshR24g22cIWSpULPxp1Ywj3sjsn7XbRvAAU3j0l")
  .header("Accept", "application/json")
  .end(function (result) {
    if(result.body.syllables && result.body.syllables.list){
      callback(result.body.syllables.list[0]);
    }
    else{
      callback("word not in api");
    }
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
  findStuttersyllables,
  firstSyllable,
  getDefaultText
}
