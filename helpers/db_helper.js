var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyC33Y85QzhPvfargKMOoJYSum1XUujo1bg",
  authDomain: "stutterio-9a716.firebaseapp.com",
  databaseURL: "https://stutterio-9a716.firebaseio.com",
  projectId: "stutterio-9a716",
  storageBucket: "stutterio-9a716.appspot.com",
  messagingSenderId: "628025936739"
};
firebase.initializeApp(config);

// helper for database functions
function writeUserData(uid, name, callback) {
  firebase.database().ref('users/' + uid).set({
    name: name,
    stutterSyllables: [],
    isTrained: false
  }).then(success => {
      callback(true);
    }, error => {
      callback(false);
    });
  }

  // adds syllables to user's list of stutter syllables
  function addStutterSyllable(uid, syllable) {
    firebase.database().ref('/users/'+uid+'/stutterSyllables').on("value", function(snapshot){
      var array = Object.values(snapshot.val());
      // console.log(array);
      if(array.indexOf(syllable) == -1){
        array.push(syllable);
      }
      // console.log(syllable);
      // console.log(array);
      firebase.database().ref('/users/'+uid).set({
        stutterSyllables: array
      });
    });
  }

  function getStutterList(uid){
    firebase.database().ref('/users/'+uid+'/stutterSyllables').on("value", function(snapshot){
      var array = Object.keys(countries).map(function(key) {
          return countries[key];
      });
      return array;
    });
  }

  function readUserData(userId){
    var userRef = firebase.database().ref('users/' + userId);
    userRef.on("value", function(snapshot){
      return snapshot.val();
    },   function(error){
      console.log("Error: " + error.code  );
    });
  }

  module.exports = {
    addStutterSyllable,
    writeUserData,
    getStutterList
  }
