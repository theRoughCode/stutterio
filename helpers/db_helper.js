var firebase = require('firebase');
const asyncjs = require('async');
const fs = require('fs');

var config = {
  apiKey: "AIzaSyC33Y85QzhPvfargKMOoJYSum1XUujo1bg",
  authDomain: "stutterio-9a716.firebaseapp.com",
  databaseURL: "https://stutterio-9a716.firebaseio.com",
  projectId: "stutterio-9a716",
  storageBucket: "stutterio-9a716.appspot.com",
  messagingSenderId: "628025936739"
};
firebase.initializeApp(config);

const default = ["hel", "world", "air", "an", "ex", "ea"];

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
  function addStutterSyllable(uid, syllables) {
    if (!syllables && !syllables.length) syllables = default;
    
    firebase.database().ref('/users/'+uid+'/stutterSyllables').on("value", function(snapshot){
      var array = Object.values(snapshot.val());
      // console.log(array);
      asyncjs.forEachOf(syllables, (value, key, callback1) => {
        if(array.indexOf(value) == -1){
          array.push(value);
        }
        callback1();
      }, err => {
        if(!err) {
          firebase.database().ref('/users/'+uid).set({
            stutterSyllables: array
          });
        }
      })

      // console.log(syllable);
      // console.log(array);

    });
  }

  function getStutterList(uid, callback){
    firebase.database().ref('/users/'+uid+'/stutterSyllables').once("value", function(snapshot){
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

  function readUserData(userId, callback){
    var userRef = firebase.database().ref('users/' + userId);
    userRef.once("value", function(snapshot){
      return callback(snapshot.val());
    }, function(error){
      console.log("Error: " + error.code  );
      return callback(null);
    });
  }

function storeMp3(uid, callback){
  // var storageRef = firebase.storage().ref();
  // var mp3Ref = storageRef.child(`${uid}.mp3`);
  var filePath = `./routes/${uid}.mp3`;
  fs.readFile(filePath, function(err,data){
    if (!err) {
        console.log('received data');
        var base64File = new Buffer(data, 'binary').toString('base64');
        firebase.database().ref('users/' + uid).child('mp3').set(base64File).then(function(snapshot){
          if(snapshot) callback(true);
          else callback(false);

          fs.unlink(filePath, (err) => {
            if (err) {
                console.log("failed to delete local mp3:" + err);
            } else {
                console.log('successfully deleted local mp3');
            }
          });
        });
    } else {
        console.log(err);
    }
});

}

function getMp3(uid, callback) {
  var userRef = firebase.database().ref(`users/${uid}/mp3`);
  userRef.once("value", function(snapshot){
    // console.log(snapshot.val());
    return callback(snapshot.val());
  }, function(error){
    console.log("Error: " + error.code  );
    callback(null);
  });
}

  module.exports = {
    addStutterSyllable,
    writeUserData,
    readUserData,
    getStutterList,
    storeMp3,
    getMp3
  }
