function getDefaultText(callback) {
  const text = "I have four cats and five dogs.  They were eager to go to the beachfront.  We took a cheap taxi ride there and saw a few geese along the way.  The dogs didn't know how to react, neither did any of the cats.  We checked in to the hotel as guests and paid a tour guide to show us around the city.  We caught some whitefish and went for a hitchhike afterwards.  We saw an otter and a bobcat, and walked past a jogger.  After the hike, we sat down to eat a chocolate waffle.  Little does my daughter know of this double life I lead."

  callback(text);
}

var unirest = require('unirest');
var db_helper = require('./db_helper')

/*
 * Consumes a user id and his sample entry and finds every occurance of a stutter in his
 * sample, then adds the stutter causing syllable to the user's list of stuttering
 * syllables.
 */
function findStutterSyllables(uid, words){
  console.log(words);
	for (var word in words) {
    console.log("\'"+words[word]+"\'")
    firstSyllable(words[word], syllable => db_helper.addStutterSyllable(uid, syllable));
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
      console.log(result.body.syllables.list[0]);
      callback(result.body.syllables.list[0]);
    }
    else{
      console.log("word not in api");
    }
	});
}

/*
 * Consumes a word and returns an array of all its synonynms using words api
 */
 function getSynonyms(word){
   var request = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms"
 	unirest.get(request)
   .header("X-Mashape-Key", "Q1wnEQpmtsmshR24g22cIWSpULPxp1Ywj3sjsn7XbRvAAU3j0l")
   .header("Accept", "application/json")
   .end(function (result) {
     if(result.body.synonyms){
       return result.body.synonyms;
     }
   }
 }
/*
 * Consumes a user id and a piece of text and returns the text after highlighting each word
 * that starts with one of the user's stuttering syllables.
 */
function listOfStutterWords(text, user, callback){
  var stutterList = db_helper.getStutterList();
  var words = text.split(" ");
  var result = []
  for (word in words) {
    firstSyllable(words[word], function(Syllable){
      if(stutterList.indexOf(Syllable) > -1){
        var entry = {
          index: word,
          word: words[word],
          synonyms: getSynonyms(words[word])
        }
        result.push(entry);
      }
    });
    callback(result);
  }
   // go through the text word by word
   // if words starts with one of the user's stuttering syllables
   // highlight word by adding tags before and after it
}

module.exports = {
  findStutterSyllables,
  listOfStutterWords,
  getDefaultText
}
