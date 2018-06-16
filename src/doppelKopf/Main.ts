import socket from "socket.io";

class Main{
   private io: socket.Server;
   private playerSocketIDList: string[] = [];
   private playerNameList: string[] = [];

   constructor(io: socket.Server){
      this.io = io;
      this.main([]);
   }

   private main(args: string[]): void{
      this.listenSocketEvents();
   }

   /**
    * Listen to socket events from clients
    */
   private listenSocketEvents(): void{
      // listen when connected
      this.io.on("connection", (clientSocket: any) => {

         // listen to register player's name
         clientSocket.on("register", (data: any) => {
            let index = this.playerNameList.indexOf(data.userName);

            // Add new player to PlayerNameList and PlayerSocketIDList
            console.log(`Welcome ${data.userName}`);
            this.playerSocketIDList.push(clientSocket.id);
            this.playerNameList.push(data.userName);
            console.log(this.playerNameList);
            console.log(this.playerSocketIDList);
            console.log();


            // check if there's already 4 players
            if(this.playerNameList.length == 4){
               // Start the game
               this.io.sockets.emit("startGame", {message: "game started ♥10"});

               // Enable next turn button for the 1. player
                  this.io.to(this.playerSocketIDList[0]).emit("enableNextTurnBtn", {});
            }
         });   // end of register

         // listen when played a card
         clientSocket.on("nextTurn", (data: any) => {
            let index: number = this.playerSocketIDList.indexOf(clientSocket.id);
            this.nextPlayer(index);
         });   // end of card played

         // Listen when disconnected
         clientSocket.on("disconnect", () => {
            let index: number = this.playerSocketIDList.indexOf(clientSocket.id);

            if(index >= 0){
               console.log(this.playerNameList[index] + " disconnected");
               this.playerSocketIDList.splice(index, 1);
               this.playerNameList.splice(index, 1);
            }

            // Print out the player's list
            console.log(this.playerNameList);
            console.log(this.playerSocketIDList);
            console.log("\n");
         }) // end of disconnected
      });
   }  // end of listenSocketEvents
   // simulate turn based


   /**
    * Notify the next player who plays the next card
    * @param {number} index
    */
   private nextPlayer(index: number): void{
      if(index < this.playerSocketIDList.length-1){
         let nextPlayerID: string = this.playerSocketIDList[index+1];
         this.io.to(nextPlayerID).emit("yourTurn", {message: "your turn"});
      }else{
         let nextPlayerID: string = this.playerSocketIDList[0];
         this.io.to(nextPlayerID).emit("yourTurn", {message: "your turn"});
      }
   }  // end of nextPlayer
}

export default Main;