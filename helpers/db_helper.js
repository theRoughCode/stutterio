// helper for database functions
function writeUserData(userId) {
  var userRef =  firebase.database().ref('users/' + userId);
}

function readUserData(userId){
  var userRef = firebase.database().ref('users/' + userId);
  userRef.on{"value", function(snapshot){
      return snapshot.val();
    },   function(error){
      console.log("Error: " + error.code  );
    }
  }
}
