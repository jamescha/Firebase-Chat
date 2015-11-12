var myFirebaseRef = new Firebase("https://testchat5000.firebaseio.com/");
var userName;

function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    userName = authData.password.email.replace(/@.*/, '');
  } else {
    console.log("User is logged out");
  }
}


var userName;
function chat() {
  var message = document.getElementById('message').value;

  myFirebaseRef.push({
    userName: userName,
    text: message
  });
}

function createUser() {
  myFirebaseRef.createUser({
        email    : document.getElementById("userName").value,
        password : document.getElementById("password").value
  }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
      }
  });
}

$(document).ready(function(){
  myFirebaseRef.onAuth(authDataCallback);

  myFirebaseRef.on("child_added", function(snapshot, prevChildKey) {
    var value = snapshot.val();
    $("td").append("<p>" + value["userName"]+ " Says: " + value["text"] + "</p>");
  });

$("#login").click(function(){
  myFirebaseRef.authWithPassword({
    email    : document.getElementById("userName").value,
    password : document.getElementById("password").value
  }, function(error, authData) {
              if (error) {
          console.log("Login Failed!", error);
        } else {
          console.log("Authenticated successfully with payload:", authData);
          userName = authData.password.email.replace(/@.*/, '');
        }
  }, {
    remember: "none"
  });
});
  $("#chat").click(function(){

      chat();
    });

});
