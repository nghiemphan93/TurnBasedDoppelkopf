// Make connection socket
var socket    = io.connect();



//Query DOM
var message   = document.getElementById("cardToPlay");
var userName  =  document.getElementById("player");
var pane      =  document.getElementById("pane");
var sendBtn   =  document.getElementById("sendBtn");
var typing    =  document.getElementById("typing");



// Emit Events
sendBtn.addEventListener("click", sendBtnClick);

var sendBtnClick = function(e){
  //Send data to server
  if(userName.value != "" && message != ""){
    socket.emit("chat", {
      message: message.value,
      userName: userName.value
    });
  }
  
  //Clear message field
  message.value = "";
}

message.addEventListener("keyup", function(e){
  //Send data to server
  socket.emit("typing", {
    message: message.value,
    userName: userName.value
  });

  //If pressed Enter, trigger Send Button
  if(e.key == "Enter"){
    sendBtnClick(e);
  }
});


//Listen to events
socket.on("chat", function(data){
  console.log(data);

  typing.innerHTML = "";
  pane.innerHTML += `
    <p>
      <strong>${data.userName}:   </strong>
      ${data.message}
    </p>
  `;
});

socket.on("typing", function(data){
  console.log(data);

  if(data.message != ""){
    typing.innerHTML = `
      <p>
        <em>${data.userName} is typing</em>
      </p>
    `
  }else{
    typing.innerHTML = "";
  }
});

