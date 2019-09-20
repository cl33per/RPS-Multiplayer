$(document).ready(function () {
    // Your web app's Firebase configuration
    var config = {
        apiKey: "AIzaSyARrlxjpHvKbZ0qp8BZerGHwdsU5-bjbpM",
        authDomain: "rps-multiplayer-e8502.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-e8502.firebaseio.com",
        projectId: "rps-multiplayer-e8502",
        storageBucket: "rps-multiplayer-e8502.appspot.com",
        messagingSenderId: "968744111064",
        appId: "1:968744111064:web:1cc6416453398e4b0080ad"
    };
    // Initialize Firebase
    firebase.initializeApp(config);
    // Create a variable to reference the database.
    var database = firebase.database();
    // connectionsRef references a specific location in our database.
    // All of our connections will be stored in this directory.
    var connectionsRef = database.ref("/playersConnected");

    // '.info/connected' is a special location provided by Firebase that is updated
    // every time the client's connection state changes.
    // '.info/connected' is a boolean value, true if the client is connected and false if they are not.
    var connectedRef = database.ref(".info/connected");
    // Initial Player Values
    var players = database.ref('/players');
    var playerOne = database.ref('/players/1');
    var playerOneName = database.ref('/players/1/Name');
    var playerOneWin = database.ref('/players/1/Wins');
    var playerOneLoss = database.ref('/players/1/Loss');
    var playerOneChoice = database.ref('/players/1/Choice');
    var playerTwo = database.ref('/players/2');
    var playerTwoName = database.ref('/players/2/Name');
    var playerTwoWin = database.ref('/players/2/Wins');
    var playerTwoLoss = database.ref('/players/2/Loss');
    var playerTwoChoice = database.ref('/players/2/Choice');
   

    // When the client's connection state changes...
    connectedRef.on("value", function (snap) {

        // If they are connected..
        if (snap.val()) {

            // Add user to the connections list.
            var con = connectionsRef.push(true);
            // Remove user from the connection list when they disconnect.
            con.onDisconnect().remove();
        }
    });

    // When first loaded or when the connections list changes...
    connectionsRef.on("value", function (snap) {

        // Display the viewer count in the html.
        // The number of online users is the number of children in the connections list.
        $("#connected-viewers").text(snap.numChildren());
    });

});