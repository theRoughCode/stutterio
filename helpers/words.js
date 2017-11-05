var unirest = require('unirest');
var db_helper = require('./db_helper')
var asyncjs = require('async');

const TRAINING_TEXT = "I have four cats and five dogs.  They were eager to go to the beachfront. I earnestly saw eight eager eagles.  I ate a chocolate waffle";
//"  We took a cheap taxi ride there and saw a few geese along the way.  The dogs didn't know how to react, neither did any of the cats.  We checked in to the hotel as guests and paid a tour guide to show us around the city.  We caught some whitefish and went for a hitchhike afterwards.  We saw an otter and a bobcat, and walked past a jogger.  After the hike, we sat down to eat a chocolate waffle.  Little does my daughter know of this double life I lead."

function getDefaultText(callback) {

    // They were eager to go to the beachfront.  We took a cheap taxi ride there and saw a few geese along the way.  The dogs didn't know how to react, neither did any of the cats.  We checked in to the hotel as guests and paid a tour guide to show us around the city.  We caught some whitefish and went for a hitchhike afterwards.  We saw an otter and a bobcat, and walked past a jogger.  After the hike, we sat down to eat a chocolate waffle.  Little does my daughter know of this double life I lead.

  callback(TRAINING_TEXT);
}


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
* Consumes in a word and returns the first syllable and synonyms of the word using words api
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
      callback(null);
    }
  });
}

/*
* Consumes a word and returns an array of all its synonynms using words api
*/
function getSynonyms(word, callback){
  var request = "https://wordsapiv1.p.mashape.com/words/" + word + "/synonyms"
  unirest.get(request)
  .header("X-Mashape-Key", "Q1wnEQpmtsmshR24g22cIWSpULPxp1Ywj3sjsn7XbRvAAU3j0l")
  .header("Accept", "application/json")
  .end(function (result) {
    if(result.body.synonyms){
      return callback(result.body.synonyms);
    } else return callback(null);
  });
}

/*
* Consumes a user id and a piece of text and returns the text after highlighting each word
* that starts with one of the user's stuttering syllables.
*/
function listOfStutterWords(user, text, callback){
  db_helper.getStutterList(user, stutterList => {
    if (!stutterList) return callback(null);
    var words = text.split(" ");
    var result = [];
    if (!words.length) return callback(null);
    asyncjs.forEachOf(words, function(item, index, callback1) {
      firstSyllable(item, syllable => {
        if (!syllable) return callback1();

        if(stutterList.indexOf(syllable) > -1) {
          getSynonyms(item, synonyms => {
            var entry = {
              index,
              word: item,
              synonyms
            }
            result.push(entry);
            callback1();
          });
        } else callback1();
      });
    }, function(err) {
        if (err) {
          console.error(err.message);
          callback(null);
        } else {
          if (!result.length) callback(null);
          else callback(result);
        }
    });
  });
}

module.exports = {
  findStutterSyllables,
  listOfStutterWords,
  getDefaultText
}
