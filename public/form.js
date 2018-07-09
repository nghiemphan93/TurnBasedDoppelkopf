

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
let playersIcon = document.getElementsByClassName("playersIcon");
let btnNeuesSpiel = document.getElementById("btnNeuesSpiel");


// SETUP list of users, hands and cardsAllowedToPlay
let player;
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

// Press Neues Spiel to play new game
if(btnNeuesSpiel !== null){
   btnNeuesSpiel.addEventListener("click", () => {
      newGame();
   });
}

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
   player = data.player;

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
   // Mark aktuell player
   let player = CircularJSON.parse(data.player);
   let index = -1;

   for(let i = 0; i <players.length; i++){
      if(player._name === players[i]._name){
         index = i;
      }
   }
   console.log(index);
   console.log(playersIcon[index]);
   playersIcon[index].classList.remove("hidden");
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
   let message = `${CircularJSON.parse(data.winner)._name} won the round with ${CircularJSON.parse(data.cardWon).name}`;

   addToPane(message);
   setTimeout(() => {
      // Clear cards played in rounds
      cardsPlayedInRound = [];
      displayCardsPlayInRound(cardsPlayedInRound);
   }, 5000);
});

// Hochzeit
socket.on("hochzeit", (data) => {
   console.log(data.message);

   addToPane(data.message);
});


// Receive card just played from other player and myself
socket.on("playCard", (data) => {
   // Add to cards played in round list
   let card = CircularJSON.parse(data.card);
   cardsPlayedInRound.push(card);

   // Display cards to the screen
   displayCardsPlayInRound(cardsPlayedInRound);

   // Display who played the card
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


// Receive round number
socket.on("roundNumber", (data) => {

   addToPane(data.roundNumber);
});

// Receive Game Over
socket.on("gameOver", (data) => {
   console.log(data.message);

   addToPane(data.message);

   btnNeuesSpiel.disabled = false;
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

   // Refresh marker of player
   let playerIndex = -1;

   for(let i = 0; i <players.length; i++){
      if(player._name === players[i]._name){
         playerIndex = i;
      }
   }

   playersIcon[playerIndex].classList.add("hidden");

}

function addToPane(message) {
   pane.innerHTML = message;
}

function appendToPane(message){
   pane.innerHTML += message;
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

function newGame(){
   // Send event new game to server
   socket.emit("newGame", {data: ""});
   btnNeuesSpiel.disabled = true;
}

async function fetchGamesPlayed(){
   let response = await fetch("http://localhost:4000/game");
   let data = await response.json();
   return data;
}

fetchGamesPlayed().then(data => console.log(data));