// connect to server socket
var socket = io();

// DOM query
let btnRegister   = document.getElementById("btnRegister");
let btnPlayCard   = document.getElementById("btnPlayCard");
let name          = document.getElementById("name");
let card          = document.getElementById("card");
let pane          =  document.getElementById("pane");

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
if (card !== null) {
   card.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
         playACard();
      }
   })
}

// Play a card
if(btnPlayCard !== null){
   btnPlayCard.addEventListener("click", () => {
      playACard();
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
   console.log(data);

   addToPane(data.message);
});

// Get user list event
socket.on("userList", (data) => {
   console.log(data);

   addToPane(data.message);
});

// Get turn to play event
socket.on("yourTurn", (data) => {
   console.log(data.message);
   btnPlayCard.disabled = false;

   addToPane(data.message);
});

// Enable play card button event
socket.on("enableNextTurnBtn", (data) => {
   btnPlayCard.disabled = false;
});

// Start game when 4 players registered event
socket.on("startGameSeeding", (data) => {
   console.log(data.message);

   addToPane(data.message);
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

// Receive cards on hand
socket.on("cardsOnHand", (data) => {
   console.log(data.message);

   addToPane(data.message);
});

// Receive card just played from other player and myself
socket.on("playCard", (data) => {
   console.log(data.message);

   addToPane(data.message);
});

// Receive cards allowed to play
socket.on("cardsAllowedToPlay", (data) => {
   console.log(data.message);

   addToPane(data.message);
});

// Receive round results
socket.on("roundResults", (data) => {
   console.log(data.winner);
   console.log(data.message);

   addToPane(data.winner);
   addToPane(data.message);
});

// Receive round number
socket.on("roundNumber", (data) => {
   console.log(data.message);

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

   addToPane(data.message);
});

// Receive Points Won
socket.on("pointsWon", (data) => {
   console.log(data.message);

   addToPane(data.message);
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
   socket.emit("register", {userName: name.value});
   name.disabled = true;
}

function playACard(){
   socket.emit("playCard", {message: `${card.value}`});
   card.value = "";
   btnPlayCard.disabled = true;
}

function addToPane(message){
   pane.innerHTML += `
      <p>
      ${message}
    </p>
   `;
}


























