var firebase = require('firebase');
const asyncjs = require('async');

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
    stutterSyllables: ["hel", "world"],
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

  function getStutterList(uid, callback){
    firebase.database().ref('/users/'+uid+'/stutterSyllables').on("value", function(snapshot){
      if (!snapshot.val()) return callback(null);
      var arr = [];
      asyncjs.forEachOf(snapshot.val(), (value, key, callback1) => {
        arr.push(value);
        callback1();
      }, err => {
        if(err) {
          console.error(err);
          callback(null);
        } else {
          callback(arr);
        }
      });
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

function storeMp3(uid, blob){
  firebase.storage().ref().child(uid).put(blob).then(function(snapshot){
    console.log("Blob uploaded successfully");
  })
}

  module.exports = {
    addStutterSyllable,
    writeUserData,
    getStutterList
    storeMp3
  }
