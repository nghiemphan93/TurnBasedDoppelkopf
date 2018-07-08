// connect to server socket
var socket = io();

// DOM query
let loginFrom = document.getElementsByClassName("login")[0];
let btnRegister = document.getElementById("btnRegister");
let btnPlayCard = document.getElementById("btnPlayCard");
let name = document.getElementById("name");
let card = document.getElementById("card");
let pane = document.getElementById("pane");
let userYourTurn = document.getElementById("userYourTurn");
let userPane = document.getElementById("userPane");
let myCards = document.getElementById("myCards");
let cardsInRound = document.getElementById("cardsInRound");
let playerTitles = document.getElementsByClassName("title");


// SETUP list of users, hands and cardsAllowedToPlay
let players = [];
let cardsOnHand = [];
let cardsPlayedInRound = [];
let cardsAllowedToPlay = [];


// ================================
// Setup events to server
// ================================
// Click Register Button to register
if (btnRegister !== null) {
   btnRegister.addEventListener("click", () => {
      register();
   });
}

// Press enter event to register
if (name !== null) {
   name.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
         register();
      }
   })
}

// Press enter event to play a card
// if (card !== null) {
//    card.addEventListener("keypress", (event) => {
//       if (event.key === "Enter") {
//          playACard();
//       }
//    })
// }

// Play a card
// if (btnPlayCard !== null) {
//    btnPlayCard.addEventListener("click", () => {
//       playACard();
//    });
// }


// ================================
// Listen to events from Servers
// ================================
// Login failed event
socket.on("registerFail", (data) => {
   console.log(data);

   addToPane(data.message);
});

// Login successful event
socket.on("registerSuccess", (data) => {
   addToPane("Welcome " + data.player._name.toUpperCase());
});


// Get player list event
socket.on("playerList", (data) => {
   console.log(data.players);

   // Add to players list
   players = data.players;


   displayPlayers(players);
});

// Get turn to play event
socket.on("yourTurn", (data) => {
   btnPlayCard.disabled = false;

   // Hollow player's name
   console.log(data.playerName);
   let index = players.indexOf((p) => p.name.localeCompare(data.playerName));
   playerTitles[index].style.border = "solid 5px red";

});

// Enable play card button event
socket.on("enableNextTurnBtn", (data) => {
   btnPlayCard.disabled = false;
});

// Start game when 4 players registered event
socket.on("startGameSeeding", (data) => {
   console.log(data.message);

   // addToPane(data.message);
});

// Receive round results
socket.on("roundResults", (data) => {
   console.log(data.message);

   addToPane(data.message);
});

// Hochzeit
socket.on("hochzeit", (data) => {
   console.log(data.message);

   addToPane(data.message);
});


// Receive card just played from other player and myself
socket.on("playCard", (data) => {
   // Add to cards played in round list
   cardsPlayedInRound.push(CircularJSON.parse(data.card));

   // Display to the screen
   displayCardsPlayInRound(cardsPlayedInRound);
});

// Receive cards on hand
socket.on("cardsOnHand", (data) => {
   cardsOnHand = CircularJSON.parse(data.cardsOnHand)._cards;


   // DATA BINDING display cards allowed to play
   displayCardsAllowedToPlay(cardsOnHand);
});

// Receive cards allowed to play
socket.on("cardsAllowedToPlay", (data) => {
   cardsAllowedToPlay = CircularJSON.parse(data.cardsAllowedToPlay)._cards;


   // DATA BINDING display cards allowed to play
   displayCardsAllowedToPlay(cardsAllowedToPlay);
});

// Receive round results
socket.on("roundResults", (data) => {
   console.log(data.winner);
   console.log(data.message);

   addToPane(data.winner);
   addToPane(data.message);

   // Clear cards played in rounds
   cardsPlayedInRound = [];
   displayCardsPlayInRound(cardsPlayedInRound);
});

// Receive round number
socket.on("roundNumber", (data) => {

   addToPane(data.message);
});

// Receive Game Over
socket.on("gameOver", (data) => {
   console.log(data.message);

   addToPane(data.message);
});

// Receive Cards Won
socket.on("cardsWon", (data) => {
   console.log(data.message);

   //addToPane(data.message);
});

// Receive Points Won
socket.on("pointsWon", (data) => {
   console.log(data.message);

   //addToPane(data.message);
});

// Receive which team wins
socket.on("whichTeamWins", (data) => {
   console.log(data.message);

   addToPane(data.message);
});


// ================================
// Help methods
// ================================
// register
function register() {
   btnRegister.disabled = true;
   loginFrom.style.display = "none";
   socket.emit("register", {userName: name.value});
   name.disabled = true;

}

function playACard(index) {
   // Send event to server
   socket.emit("playCard", {message: index});

   // Remove from the cards allowed to play list
   cardsAllowedToPlay.splice(index, 1);

   // Refresh all cards allowed to play
   displayCardsAllowedToPlay(cardsAllowedToPlay);

}

function addToPane(message) {
   pane.innerHTML = message;
}

function addToUserPane(message) {
   userPane.innerHTML = message;
}

function hideUserYourTurn() {
   userYourTurn.classList.remove("hidden");
}

function showUserYourTurn() {
   userYourTurn.classList.add("hidden");
}

function displayCardsAllowedToPlay(cards) {
   myCards.innerHTML = `<ul>`;

   for (let card of cards) {
      console.log(card.name);
      myCards.innerHTML += `<li class="cardsAllowed"><img src="/images/png/${card._strength}.png" alt=""></li>`;
   }
   myCards.innerHTML += `</ul>`;

   let cardsAllowed = document.getElementsByClassName("cardsAllowed");

   // ADD EVENT LISTENER
   for (let i = 0; i < cardsAllowed.length; i++) {
      cardsAllowed[i].addEventListener("click", () => {
         playACard(i);
      });
   }
}

function displayCardsPlayInRound(cards){
   cardsInRound.innerHTML = `<ul>`;

   for (let card of cards) {
      console.log(card.name);
      cardsInRound.innerHTML += `<li><img src="/images/png/${card._strength}.png" alt=""></li>`;
   }

   cardsInRound.innerHTML += `</ul>`;
}

function displayPlayers(players){
   // DATA BINDING display all players at top
   for (let i = 0; i < players.length; i++) {
      // Display player accordingly at top
      playerTitles[i].innerHTML = players[i]._name.toUpperCase();
   }
}
