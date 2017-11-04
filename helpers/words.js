function getDefaultText(callback) {
  const text = "I have four cats and five dogs."

  callback(text);
}

/*
 * Consumes a user id and his sample entry and finds every occurance of a stutter in his 
 * sample, then adds the stutter causing syllabal to the user's list of stuttering 
 * syllabals.
 */
function findStuterSyllabals(text, user){
  // go through the text word by word
  // if word is a stuter
  // then add its first syllabal to the user's list of stutter syllabals
}

/*
 * Consumes a user id and a piece of text and returns the text after highlighting each word 
 * that starts with one of the user's stuttering syllabals.
 */
function listOfStutterWords(text, user){
   // go through the text word by word
   // if words starts with one of the user's stuttering syllabals 
   // highlight word by adding tags before and after it 
}
module.exports = {
  getDefaultText
}
