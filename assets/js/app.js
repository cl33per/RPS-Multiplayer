//Initiate firebase
var config = {
    apiKey: "AIzaSyARrlxjpHvKbZ0qp8BZerGHwdsU5-bjbpM",
    authDomain: "rps-multiplayer-e8502.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-e8502.firebaseio.com",
    projectId: "rps-multiplayer-e8502",
    storageBucket: "rps-multiplayer-e8502.appspot.com",
    messagingSenderId: "968744111064",
    appId: "1:968744111064:web:1cc6416453398e4b0080ad"
};

firebase.initializeApp(config);

var database = firebase.database();

var playerConnection = database.ref("/playerConnection");
var isConnected = database.ref(".info/connected");
var playerList = database.ref("/players");
var playerListOne = database.ref("/players/1");
var playerListTwo = database.ref("/players/2");
var playerListOneName = database.ref("/players/1/Name");
var playerListTwoName = database.ref("/players/2/Name");
var playerListOneWins = database.ref("/players/1/Wins");
var playerListTwoWins = database.ref("/players/2/Wins");
var playerListOneLosses = database.ref("/players/1/Losses");
var playerListTwoLosses = database.ref("/players/2/Losses");
var playerListOneChoice = database.ref("/players/1/Choice");
var playerListTwoChoice = database.ref("/players/2/Choice");


var playerOneWinCount = 0;
var playerOneLossCount = 0;
var playerTwoWinCount = 0;
var playerTwoLossCount = 0;
var playerOneName = null;
var playerTwoName = null;

var playerOneTurn = false;
var playerTwoTurn = false;
var playerOneTurnPlayerTwoView = false;
var playerTwoTurnPlayerOneView = false;

var playerChoices = ["Rock", "Paper", "Scissors"];
var playerOneChoice = null;
var playerTwoChoice = null;


//Hide the necessary pieces on loading the page
$(document).ready(function () {
    $(".greetings").hide();
    $(".yourturn").hide();
    $(".waitingmessage").hide();
    $(".toomanyplayers").hide();
    $(".playeronescore").hide();
    $(".playertwoscore").hide();
    $(".playeronechoicesrow").hide();
    $(".playertwochoicesrow").hide();
});

//player connects push to player base, if they disconnect, then delete from firebase
isConnected.on("value", function (snap) {

    if (snap.val()) {
        var playerConnect = playerConnection.push(true);
        playerConnect.onDisconnect().remove();
    }
});



//Third player tries to join
database.ref().once("value", function (snap) {


    if (snap.child("players/2").exists() === true && snap.child("players/1").exists() === true) {
        $(".toomanyplayers").show();
        $(".namesubmission").hide();
        return;
    }

});


playerListOneName.on("value", function (snap) {
    if (snap.exists()) {
        playerOneName = snap.val();
        $("#playeronename").html(playerOneName);
        $("#waitingforplayerone").hide();
    }

    if (snap.exists() === false) {
        $("#playeronename").html("");
        $("#waitingforplayerone").show();
        $(".playeronechoicesrow").hide();

    }


});

playerListTwoName.on("value", function (snap) {
    if (snap.exists()) {
        playerTwoName = snap.val();
        $("#playertwoname").html(playerTwoName);
        $("#waitingforplayertwo").hide();

    }
    if (snap.exists() === false) {
        $("#playertwoname").html("");
        $("#waitingforplayertwo").show();
        $(".playeronechoicesrow").hide();


    }

});

playerListOneWins.on("value", function (snap) {
    if (snap.exists()) {
        playerOneWinCount = snap.val();
        $("#playeronewincount").html(playerOneWinCount);
        $(".playeronescore").show();
    } else {
        $(".playeronescore").hide();
    }

});

playerListTwoWins.on("value", function (snap) {
    if (snap.exists()) {
        playerTwoWinCount = snap.val();
        $("#playertwowincount").html(playerTwoWinCount);
        $(".playertwoscore").show();
    } else {
        $(".playertwoscore").hide();
    }

});

playerListOneLosses.on("value", function (snap) {
    if (snap.exists()) {
        playerOneLossCount = snap.val();
        $("#playeronelosscount").html(playerOneLossCount);
        $(".playeronescore").show();
    } else {
        $(".playeronescore").hide();
    }

});

playerListTwoLosses.on("value", function (snap) {
    if (snap.exists()) {
        playerTwoLossCount = snap.val();
        $("#playertwolosscount").html(playerTwoLossCount);
        $(".playertwoscore").show();
    } else {
        $(".playertwoscore").hide();
    }

});





function startPlayerOne() {
    playerOneName = $("#playernameinput").val().trim();
    $("#playeronename").html(playerOneName);

    $("#playername").html(playerOneName);
    $("#playernumber").html(" 1");
    $(".greetings").show();

    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount
    });

    $("#playernameinput").val("");
    $(".namesubmission").hide();
    $("#waitingforplayerone").hide();

    $("#playeronewincount").html(playerOneWinCount);
    $("#playeronelosscount").html(playerOneLossCount);
    $(".playeronescore").show();


}

function startPlayerTwo() {
    playerTwoName = $("#playernameinput").val().trim();
    $("#playertwoname").html(playerTwoName);

    $("#playername").html(playerTwoName);
    $("#playernumber").html(" 2");
    $(".greetings").show();

    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount
    });

    $("#playernameinput").val("");
    $(".namesubmission").hide();
    $("#waitingforplayertwo").hide();

    $("#playertwowincount").html(playerTwoWinCount);
    $("#playertwolosscount").html(playerTwoLossCount);
    $(".playertwoscore").show();


}

function startPlayerOneWithExisting() {
    playerOneName = $("#playernameinput").val().trim();
    $("#playeronename").html(playerOneName);

    $("#playername").html(playerOneName);
    $("#playernumber").html(" 1");
    $(".greetings").show();

    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount
    });

    $("#playernameinput").val("");
    $(".namesubmission").hide();
    $("#waitingforplayerone").hide();

    $("#playeronewincount").html(playerOneWinCount);
    $("#playeronelosscount").html(playerOneLossCount);
    $(".playeronescore").show();


}




$(document).on("click", "#adduser", function () {

    if (playerOneName === null && playerTwoName === null) {

        startPlayerOne();
        playerOneTurn = true;
        database.ref("/players/1").onDisconnect().remove();
        return;
    }

    if (playerOneName != null && playerTwoName === null) {
        startPlayerTwo();
        $(".waitingmessage").show();
        database.ref("/players/2").onDisconnect().remove();
        return;
    }
    if (playerOneName === null && playerTwoName != null) {
        startPlayerOneWithExisting();
        playerOneTurn = true;
        $(".playeronechoicesrow").show();
        database.ref("/players/1").onDisconnect().remove();
        return;
    }
});


function playerOneWin() {
    playerOneWinCount++;
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: null

    });
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: null
    });
    $("#middlemessage").html(playerOneName + " Wins!");
    $("#middlemessage").show();
    setTimeout(function hideMiddleMessage() {
        $("#middlemessage").hide();
    }, 3000);

    $("#playeronechoice").show();
    $("#playertwochoice").show();
    setTimeout(function hidePlayerOneChoice() {
        $("#playeronechoice").hide();
    }, 3000);
    setTimeout(function hidePlayerTwoChoice() {
        $("#playertwochoice").hide();
    }, 3000);
}

function playerTwoWin() {
    playerTwoWinCount++;
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: null

    });
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: null
    });
    $("#middlemessage").html(playerTwoName + " Wins!");
    $("#middlemessage").show();
    setTimeout(function hideMiddleMessage() {
        $("#middlemessage").hide();
    }, 3000);

    $("#playeronechoice").show();
    $("#playertwochoice").show();
    setTimeout(function hidePlayerOneChoice() {
        $("#playeronechoice").hide();
    }, 3000);
    setTimeout(function hidePlayerTwoChoice() {
        $("#playertwochoice").hide();
    }, 3000);

    playerTwoTurn = false;
}

function playerOneLoss() {
    playerOneLossCount++;
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: null

    });
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: null
    });
}

function playerTwoLoss() {
    playerTwoLossCount++;
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: null

    });
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: null
    });
    playerTwoTurn = false;
}

function tieGame() {
    $("#playeronechoice").show();
    $("#playertwochoice").show();
    setTimeout(function hidePlayerOneChoice() {
        $("#playeronechoice").hide();
    }, 3000);
    setTimeout(function hidePlayerTwoChoice() {
        $("#playertwochoice").hide();
    }, 3000);
    $("#middlemessage").html("Tie Game!");
    $("#middlemessage").show();
    setTimeout(function hideMiddleMessage() {
        $("#middlemessage").hide();
    }, 3000);
    playerTwoTurn = false;

    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: null

    });
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: null
    });
}




$(document).on("click", "#playeronerock", function () {
    playerOneChoice = "Rock";
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: playerOneChoice
    });
    $("#playeronechoice").html(playerOneChoice);
    $("#playeronechoice").show();
    $(".playeronechoicesrow").hide();
    $(".yourturn").hide();
    $(".waitingmessage").show();

});

$(document).on("click", "#playeronepaper", function () {
    playerOneChoice = "Paper";
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: playerOneChoice
    });
    $("#playeronechoice").html(playerOneChoice);
    $("#playeronechoice").show();
    $(".playeronechoicesrow").hide();
    $(".yourturn").hide();
    $(".waitingmessage").show();
});

$(document).on("click", "#playeronescissors", function () {
    playerOneChoice = "Scissors"
    database.ref("/players/1").set({
        Name: playerOneName,
        Wins: playerOneWinCount,
        Losses: playerOneLossCount,
        Choice: playerOneChoice
    });
    $("#playeronechoice").html(playerOneChoice);
    $("#playeronechoice").show();
    $(".playeronechoicesrow").hide();
    $(".yourturn").hide();
    $(".waitingmessage").show();

});

$(document).on("click", "#playertworock", function () {
    playerTwoChoice = "Rock";
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: playerTwoChoice
    });
    $("#playertwochoice").html(playerTwoChoice);
    $("#playertwochoice").show();
    $(".playertwochoicesrow").hide();
    $(".yourturn").hide();


});

$(document).on("click", "#playertwopaper", function () {
    playerTwoChoice = "Paper";
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: playerTwoChoice
    });
    $("#playertwochoice").html(playerTwoChoice);
    $("#playertwochoice").show();
    $(".playertwochoicesrow").hide();
    $(".yourturn").hide();



});

$(document).on("click", "#playertwoscissors", function () {
    playerTwoChoice = "Scissors"
    database.ref("/players/2").set({
        Name: playerTwoName,
        Wins: playerTwoWinCount,
        Losses: playerTwoLossCount,
        Choice: playerTwoChoice
    });
    $("#playertwochoice").html(playerTwoChoice);
    $("#playertwochoice").show();
    $(".playertwochoicesrow").hide();
    $(".yourturn").hide();



});

function evaluateChoices() {

    if (playerOneChoice === "Rock" && playerTwoChoice === "Rock") {
        tieGame();

    } else if (playerOneChoice === "Rock" && playerTwoChoice === "Paper") {
        playerOneLoss();
        playerTwoWin();
    } else if (playerOneChoice === "Rock" && playerTwoChoice === "Scissors") {
        playerOneWin();
        playerTwoLoss();
    } else if (playerOneChoice === "Paper" && playerTwoChoice === "Rock") {
        playerOneWin();
        playerTwoLoss();
    } else if (playerOneChoice === "Paper" && playerTwoChoice === "Paper") {
        tieGame();

    } else if (playerOneChoice === "Paper" && playerTwoChoice === "Scissors") {
        playerOneLoss();
        playerTwoWin();
    } else if (playerOneChoice === "Scissors" && playerTwoChoice === "Rock") {
        playerOneLoss();
        playerTwoWin();
    } else if (playerOneChoice === "Scissors" && playerTwoChoice === "Paper") {
        playerOneWin();
        playerTwoLoss();
    } else if (playerOneChoice === "Scissors" && playerTwoChoice === "Scissors") {
        tieGame();
    }
}


playerListOneChoice.on("value", function (snap) {
    if (snap.exists() && playerOneTurn === false) { //player 2 sees this only cause of joining makes playerTwoTurn = false
        $(".playertwochoicesrow").show();
        $(".yourturn").show();
        $(".waitingmessage").hide();
        playerOneChoice = snap.val();
        $("#playeronechoice").hide();
        $("#playeronechoice").html(playerOneChoice);
    }

});

playerListTwoChoice.on("value", function (snap) {
    if (snap.exists()) {
        playerTwoChoice = snap.val();
        $("#playertwochoice").html(playerTwoChoice);
        $(".waitingmessage").hide();
        evaluateChoices();

    }
});

playerList.on("value", function (snap) {


    if (snap.numChildren() === 2 && playerOneTurn === true) { //Only player 1 view
        $(".playeronechoicesrow").show();
        $(".yourturn").show();
        playerTwoTurn = true;

    }
});
