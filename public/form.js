// connect to server socket
var socket = io();

// DOM query
let loginFrom     = document.getElementsByClassName("login")[0];
let btnRegister   = document.getElementById("btnRegister");
let name          = document.getElementById("name");
let card          = document.getElementById("card");
let pane          = document.getElementById("pane");
let userPane      = document.getElementById("userPane");
let myCards       = document.getElementById("myCards");
let cardsInRound  = document.getElementById("cardsInRound");
let playerTitles  = document.getElementsByClassName("title");
let playersIcon   = document.getElementsByClassName("playersIcon");
let btnNeuesSpiel = document.getElementById("btnNeuesSpiel");
let wonAverage    = document.getElementsByClassName("wonAverage");
let winner        = document.getElementsByClassName("winner");
let titleAside    = document.getElementsByClassName("titleAside");
let points        = document.getElementsByClassName("points");

// SETUP list of users, hands and cardsAllowedToPlay
let player;
let players = [];
let cardsOnHand = [];
let cardsPlayedInRound = [];
let cardsAllowedToPlay = [];
let playersInRound = [];


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
if (btnNeuesSpiel !== null) {
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
   player = CircularJSON.parse(data.player);

   // Display userName at the right
   userPane.innerHTML = player._name.toUpperCase();

   addToPane("Welcome " + player._name.toUpperCase());
});


// Get player list event
socket.on("playerList", (data) => {

   // Add to players list
   players = data.players;

   displayPlayers();
});

// Get turn to play event
socket.on("yourTurn", (data) => {

});

// Enable play card button event
socket.on("notifyNextTurn", (data) => {
   // Mark aktuell player
   let player = CircularJSON.parse(data.player);

   for (let i = 0; i < players.length; i++) {
      if (player._name === players[i]._name) {
         playersIcon[i].classList.remove("hidden");
      }else{
         playersIcon[i].classList.add("hidden");
      }
   }


});

// Start game when 4 players registered event
socket.on("startGameSeeding", (data) => {
   console.log(data.message);

   // Clear everything
   cardsOnHand = [];
   cardsPlayedInRound = [];
   cardsAllowedToPlay = [];
   playersInRound = [];

   // Fetch and show new data from players
   displayPlayers();

   // Reset points
   for(let i = 0; i<players.length; i++){
      points[i].innerHTML = 0 + " points";
   }

});

// Receive round results
socket.on("roundResults", (data) => {
   let message = `${CircularJSON.parse(data.winner)._name} won the round with ${CircularJSON.parse(data.cardWon).name}`;

   console.log(winner);

   // Display winner
   let index = -1;
   for(let i = 0; i<players.length; i++){
      if(players[i]._name === CircularJSON.parse(data.winner)._name){
         index = i;
      }
   }
   console.log(index);
   winner[index].classList.remove("hidden");

   addToPane(message);
   setTimeout(() => {
      // Clear cards played in rounds and players in round
      cardsPlayedInRound = [];
      playersInRound = [];
      displayCardsPlayInRound();

      // Undisplay winner
      winner[index].classList.add("hidden");
   }, 5000);


});

// Hochzeit
socket.on("hochzeit", (data) => {
   console.log(data.message);

   addToPane(data.message);
   setTimeout(() => {}, 4000);
});


// Receive card just played from other player and myself
socket.on("playCard", (data) => {
   // Add to cards played in round list
   let card = CircularJSON.parse(data.card);
   let player = CircularJSON.parse(data.player);

   cardsPlayedInRound.push(card);
   playersInRound.push(player);

   // Display cards to the screen
   displayCardsPlayInRound();

   // Display who played the card
});

// Receive cards on hand
socket.on("cardsOnHand", (data) => {
   cardsOnHand = CircularJSON.parse(data.cardsOnHand)._cards;

   console.log(cardsOnHand);


   // DATA BINDING display cards allowed to play
   displayCardsOnHand(cardsOnHand);
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

   // addToPane(data.message);

   btnNeuesSpiel.disabled = false;
});

// Receive Cards Won
socket.on("cardsWon", (data) => {
   console.log(data.message);

   //addToPane(data.message);
});

// Receive Points Won
socket.on("pointsWon", (data) => {
   let pointsWon = CircularJSON.parse(data.points);
   let player = CircularJSON.parse(data.player);


   for(let i = 0; i<points.length; i++){
      if(players[i]._name === player._name){
         points[i].innerHTML = pointsWon + " points";
      }
   }

});

// Receive which team wins
socket.on("whichTeamWins", (data) => {
   console.log(data.message);

   setTimeout(() => addToPane(data.message), 4000);

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

   // Remove click event listener
   removeClickEvent();
}

function addToPane(message) {
   pane.innerHTML = message;
}

function appendToPane(message) {
   pane.innerHTML += message;
}

function addToUserPane(message) {
   userPane.innerHTML = message;
}

function removeClickEvent(){
   // let cardsAllowed = document.getElementsByClassName("cardsAllowed");
   //
   // // REMOVE EVENT LISTENER
   // for (let i = 0; i < cardsAllowed.length; i++) {
   //    cardsAllowed[i].style.pointerEvents = "none";
   // }
}

function displayCardsOnHand(cards) {
   let template = `<ul>`;

   for (let card of cards) {
      template += `<li class="cardsAllowed"><img src="/images/png/${card._strength}.png" alt=""></li>`;
   }
   template += `</ul>`;
   myCards.innerHTML = template;
}

function displayCardsAllowedToPlay(cards) {
   let template = `<ul>`;

   for (let card of cards) {
      template += `<li class="cardsAllowed"><img src="/images/png/${card._strength}.png" alt=""></li>`;
   }
   template += `</ul>`;
   myCards.innerHTML = template;
   console.log(myCards);

   console.log(cardsAllowedToPlay);

   let cardsAllowed = document.getElementsByClassName("cardsAllowed");

   // ADD EVENT LISTENER
   for (let i = 0; i < cardsAllowed.length; i++) {
      cardsAllowed[i].addEventListener("click", () => playACard(i));
   }
}

function displayCardsPlayInRound() {
   cardsInRound.innerHTML = `<ul>`;

   for (let i = 0; i < cardsPlayedInRound.length; i++) {
      cardsInRound.innerHTML += `
              <li>
                 <img src="/images/png/${cardsPlayedInRound[i]._strength}.png" alt="">
                 <div class="cardMember">${playersInRound[i]._name.toUpperCase()}</div>
              </li>`;
   }

   cardsInRound.innerHTML += `</ul>`;
}

function displayPlayers() {
   // DATA BINDING display all players at top and aside
   for (let i = 0; i < players.length; i++) {
      // Display player accordingly at top
      playerTitles[i].innerHTML = players[i]._name.toUpperCase();
      titleAside[i].innerHTML = players[i]._name.toUpperCase();

      fetchWonAverage(players[i]._name).then(data => wonAverage[i].innerHTML = `win ${data}%`);
   }
}

function newGame() {
   // Send event new game to server
   socket.emit("newGame", {data: ""});
   btnNeuesSpiel.disabled = true;
}

async function fetchWonAverage(playerName) {
   let response = await fetch("http://localhost:4000/game");
   let data = await response.json();

   let gamesPlayed = await data.filter(game => game.player._name === playerName);

   let winCounter = 0;
   gamesPlayed.forEach(game => {
      if (game.wonOrNot !== 0) {
         winCounter++;
      }
   });
   let percent = winCounter / gamesPlayed.length * 100;
   percent.toFixed(2);

   return percent.toFixed(2);
}



