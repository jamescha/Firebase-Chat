
//Set reference to Firebase
var myFirebaseRef = new Firebase("https://testchat5000.firebaseio.com/");
var userName;

//Verify if user is logged in. If they are set userName to use in posts.
function authDataCallback(authData) {
  if (authData) {
    console.log("User " + authData.uid + " is logged in with " + authData.provider);
    userName = authData.password.email.replace(/@.*/, '');
    document.getElementById('notice').innerHTML="You are logged in.";
    document.getElementById('notice').style.backgroundColor = "green";
  } else {
    console.log("User is logged out");
    userName = undefined;
    document.getElementById('notice').innerHTML="Please log in to chat.";
    document.getElementById('notice').style.backgroundColor = "red";
  }
}

//Push the message to firebase
function chat() {
  var message = document.getElementById('message').value;

  if(userName === undefined) {
    $(function() {
      $("#dialogMessage").text("Must be logged in to chat.");
      $("#dialog").dialog();
    });
  }


  myFirebaseRef.push({
    userName: userName,
    text: message
  });
}

//Create user using Email and Password Auth built into Firebase
function createUser() {
  myFirebaseRef.createUser({
        email    : document.getElementById("userName").value,
        password : document.getElementById("password").value
  }, function(error, userData) {
      if (error) {
        console.log("Error creating user:", error);
        $(function() {
          $("#dialogMessage").text(error);
          $("#dialog").dialog();
        });
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        $(function() {
          $("#dialogMessage").text("Successfully Created User. Please Login to chat");
          $("#dialog").dialog();
        });
      }
  });
}

$(document).ready(function(){
  //Notify user if they are logged in or not.
  myFirebaseRef.onAuth(authDataCallback);

  //Fill the div with all the messages
  myFirebaseRef.on("child_added", function(snapshot, prevChildKey) {
    var value = snapshot.val();
    $("#messages").append('<paper-card> ' + value["userName"]+ ' Says: ' + value["text"] + '</paper-card>');
  });

  //Log in user for Firebase with email and password Auth built into Firebase
  $("#login").click(function(){
    myFirebaseRef.authWithPassword({
      email    : document.getElementById("userName").value,
      password : document.getElementById("password").value
    }, function(error, authData) {
                if (error) {
            console.log("Login Failed!", error);
            $(function() {
              $("#dialogMessage").text(error);
              $("#dialog").dialog();
            });
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
