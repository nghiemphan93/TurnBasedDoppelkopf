// connect to server socket
var socket = io();

// DOM query
let btnRegister = document.getElementById("btnRegister");
let btnNextTurn = document.getElementById("btnNextTurn");
let name = document.getElementById("name");

// ================================
// setup events to server
// ================================
// send register data to server
if (btnRegister !== null) {
   btnRegister.addEventListener("click", () => {
      register();
   });
}

// press enter event to register
if (name !== null) {
   name.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
         register();
      }
   })
}

// next turn event to notify server
if(btnNextTurn !== null){
   btnNextTurn.addEventListener("click", () => {
      socket.emit("nextTurn", {});
      btnNextTurn.disabled = true;
   });
}


// ================================
// listen to events from Servers
// ================================
// login failed event
socket.on("registerFail", (data) => {
   console.log(data);
});

// login successful event
socket.on("registerSuccess", (data) => {
   console.log(data);
});

// get user list event
socket.on("userList", (data) => {
   console.log(data);
});

// get turn to play event
socket.on("yourTurn", (data) => {
   btnNextTurn.disabled = false;
});

// enable next turn button event
socket.on("enableNextTurnBtn", (data) => {
   btnNextTurn.disabled = false;
});

// start game when 4 players registered event
socket.on("startGame", (data) => {
   console.log(data.message);
});



// ================================
// Help methods
// ================================
// register
function register() {
   socket.emit("register", {userName: name.value});
   name.disabled = true;
}


























