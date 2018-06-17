import socket from "socket.io";
import {PlayersSetupFactory} from "./Controller/PlayersSetupFactory";
import {Player} from "./Model/PlayerModel/Player";
import {GameController} from "./Controller/GameController";
import {Card} from "./Model/CardModel/Card";
import {SortHelper} from "./Model/CardModel/SortHelper";

export class SocketSetup{
   private _io: socket.Server;
   private _playerSocketIDList: string[] = [];
   private _playerNameList: string[] = [];
   private _gameController: GameController;
   private _alreadyPlayed: number = 0;

   constructor(io: socket.Server, gameController: GameController){
      this._io = io;
      this.gameController = gameController;
      this.main();
   }

   public main(): void{
      this.listenSocketEvents();
   }

   /**
    * Listen to socket events from clients
    */
   public listenSocketEvents(): void{
      // listen when connected
      this._io.on("connection", (clientSocket: any) => {
         // listen when played a card
         clientSocket.on("playCard", (data: any) => {
            let playerIndex: number = this.gameController.playersSetupFactory.playerSocketIDList.indexOf(clientSocket.id);
            let card: Card = this.gameController.playersSetupFactory.players[playerIndex].cardsOnHand.cards[data.message];
            this.gameController.playersSetupFactory.players[playerIndex].cardsOnHand.remove(card);
            console.log(card.toString());

            // Save the card to cardsPlayedPerRound
            this.gameController.cardsSetupFactory.cardsPlayedPerRound.add(card);

            // Notify all players
            this.io.sockets.emit("playCard", {message: `${this.gameController.playersSetupFactory.players[playerIndex].toString()} played ${card.toString()}`});

            // Call the next player
            this.nextTurn(clientSocket, data);

         });

      });
   }  // end of listenSocketEvents
   // simulate turn based


   /**
    * Player register
    * @param clientSocket
    * @param data
    * @param {PlayersSetupFactory} playersSetupFactory
    */
   public register(clientSocket: any, data: any, playersSetupFactory: PlayersSetupFactory){
      // Add new player to PlayerNameList and PlayerSocketIDList
      console.log(`Welcome ${data.userName}`);
      playersSetupFactory.playerSocketIDList.push(clientSocket.id);
      playersSetupFactory.players.push(new Player(data.userName, ""));
      console.log(playersSetupFactory.players.toString());
      console.log(playersSetupFactory.playerSocketIDList.toString());
      console.log();

      // Send back a message to confirm registered
      clientSocket.emit("registerSuccess", {message: "registerSuccess"});


      // Check if there's already 4 players
      if(playersSetupFactory.players.length == 4){
         // Setup cards
         playersSetupFactory.gameController.initGame();

         // Send message start game to all players
         this.io.sockets.emit("startGameSeeding", {message: "game started ♥10"});

         // Send round number to all players
         this.sendRoundNumber();

         // Send cards on hand to each player
         this.sendCardsOnhand();

         // Enable next turn button for the 1. player
         this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay.addAll(this.gameController.playersSetupFactory.players[0].cardsOnHand.cards);
         this.io.to(playersSetupFactory.playerSocketIDList[0]).emit("cardsAllowedToPlay", {message: `Cards allowed to play: ${this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay.toString()}`});
         this.io.to(playersSetupFactory.playerSocketIDList[0]).emit("enableNextTurnBtn", {});

         console.log(this.gameController.playersSetupFactory.players.toString());
         console.log("Team Kreuz Queen: " + this.gameController.teamKreuzQueen.toString());
         console.log("Team No Kreuz Queen: " + this.gameController.teamNoKreuzQueen.toString());
      }
   } // end of register

   /**
    * Player disconnect
    * @param clientSocket
    * @param {PlayersSetupFactory} playersSetupFactory
    */
   public disconnect(clientSocket: any, playersSetupFactory: PlayersSetupFactory){
      let index: number = playersSetupFactory.playerSocketIDList.indexOf(clientSocket.id);

      if(index >= 0){
         console.log(playersSetupFactory.players[index] + " disconnected");
         playersSetupFactory.playerSocketIDList.splice(index, 1);
         playersSetupFactory.players.splice(index, 1);
      }

      // Print out the player's list
      console.log(playersSetupFactory.players);
      console.log(playersSetupFactory.playerSocketIDList);
      console.log();
   }

   /**
    * Next turn
    * @param clientSocket
    * @param {PlayersSetupFactory} this.gameController.cardsSetupFactory
    */
   public nextTurn(clientSocket: any, data: any){
      let index: number = this.gameController.playersSetupFactory.playerSocketIDList.indexOf(clientSocket.id);
      this.nextPlayer(index);
   }

   /**
    * Notify the next player who plays the next card
    * @param {number} index
    */
   public nextPlayer(index: number): void{
      if(index < this.gameController.playersSetupFactory.playerSocketIDList.length-1){
         // Determine what cards next player allowed to play
         this.gameController.playersSetupFactory.players[index+1].cardsAllowedToPlay.clear();
         this.gameController.playersSetupFactory.players[index+1].setWhatCardToPlay(this.gameController.cardsSetupFactory.cardsPlayedPerRound.cards[0]);


         let nextPlayerID: string = this.gameController.playersSetupFactory.playerSocketIDList[index+1];

         // Send cards allowed to play to the next player
         this.io.to(nextPlayerID).emit("cardsAllowedToPlay", {message: `Cards allowed to play: ${this.gameController.playersSetupFactory.players[index+1].cardsAllowedToPlay.toString()}`});

         this.io.to(nextPlayerID).emit("yourTurn", {message: "your turn"});
      }else{
         // End of the round
         console.log("Round ended");
         this.gameController.roundEnded = true;

         // Determine who wins the round
         SortHelper.sortByStrength(this.gameController.cardsSetupFactory.cardsPlayedPerRound);
         let roundWinner: Player = this.gameController.whoWinsTheRound(this.gameController.cardsSetupFactory.cardsPlayedPerRound);
         let cardsPerRound: Array<Card> = this.gameController.cardsSetupFactory.cardsPlayedPerRound.cards;

         // Add the winner and the won card to array rounds
         this.gameController.rounds.push(roundWinner);
         this.gameController.rounds.push(cardsPerRound[0]);

         // Add the won cards to the players' CardsWon
         roundWinner.cardsWon.addAll(cardsPerRound);

         // rearrange the order of players for next round
         // winner of the last round begins the next round
         for(let i = 0; i < this.gameController.playersSetupFactory.players.length; i++){
            let player: Player = this.gameController.playersSetupFactory.players[0];
            let playerSocketID: string = this.gameController.playersSetupFactory.playerSocketIDList[0];

            if(player.toString().localeCompare(roundWinner.toString()) == 0){
               // if the first position is the round winner, stop
               break;
            }else{
               // add the first player to the end of the players list
               this.gameController.playersSetupFactory.players.push(player);
               this.gameController.playersSetupFactory.playerSocketIDList.push(playerSocketID);

               // remove the first player from the player list
               this.gameController.playersSetupFactory.players.splice(0,1);
               this.gameController.playersSetupFactory.playerSocketIDList.splice(0, 1);
            }
         }  // end of for


         // Send results of the round
         this.io.sockets.emit("roundResults", {
            winner: `${roundWinner.toString()} won the round with ${cardsPerRound[0].toString()}`,
            message: `Cards played in round: ${this.gameController.cardsSetupFactory.cardsPlayedPerRound}`
         });


         // clear the CardsPlayedPerRound
         this.gameController.cardsSetupFactory.cardsPlayedPerRound.clear();

         for(let player of this.gameController.playersSetupFactory.players){
            player.cardsAllowedToPlay.clear();
         }

         // until round 4, check Hochzeit for the first three rounds
         if(this.gameController.numbRound == 4 && this.gameController.whoHasTwoKreuzQueen != null){
            let dreamPartner: Player | null = this.gameController.checkHochzeit();
            if(dreamPartner != null){
               // Send Hochzeit to all players
               this.io.sockets.emit("hochzeit", {message: `Hochzeit: ${dreamPartner.toString()} plays with ${this.gameController.whoHasTwoKreuzQueen}`});
            }else{
               // Send Hochzeit to all players
               this.io.sockets.emit("hochzeit", {message: `Hochzeit: ${this.gameController.whoHasTwoKreuzQueen} plays alone `});
            }
         }

         // New Round, next Turn
         if(this.gameController.numbRound == 4){
            // finish
            this.io.sockets.emit("gameOver", {message: `Game Over`});

            // Send all cards each player collected
            let cardsWon: string = "";
            let pointsWon: string = "";
            for(let player of this.gameController.playersSetupFactory.players){
               cardsWon += player.toString() + " collected: " + player.cardsWon.toString() + "\n";
               pointsWon += player.toString() + " achieved: " + player.calcPointsWonPerGame() + " points\n";
            }
            this.io.sockets.emit("cardsWon", {message: `${cardsWon}`});
            this.io.sockets.emit("pointsWon", {message: `${pointsWon}`});

            // Sum up all points, which team wins
            this.gameController.sumUpPointTwoTeams();

            let whichTeamWins: string = "";
            whichTeamWins += `${this.gameController.teamKreuzQueen.toString()} achieved ${this.gameController.pointTeamKreuzQueen} points \n`;
            whichTeamWins += `${this.gameController.teamNoKreuzQueen.toString()} achieved ${this.gameController.pointTeamNoKreuzQueen} points \n`;
            if(this.gameController.whichTeamWon() > 0){
               whichTeamWins += `Team Kreuz Queen wins`;
            }else{
               whichTeamWins += `Team No Kreuz Queen wins`;
            }
            this.io.sockets.emit("whichTeamWins", {message: `${whichTeamWins}`});

            // set game won for each player
            this.gameController.setGameWonEachPlayer();

            // first setPartner
            this.gameController.setPartner();


         }else{
            // Create new round
            this.sendRoundNumber();
            this.sendCardsOnhand();
            this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay.addAll(this.gameController.playersSetupFactory.players[0].cardsOnHand.cards);

            let nextPlayerID: string = this.gameController.playersSetupFactory.playerSocketIDList[0];
            this.io.to(nextPlayerID).emit("cardsAllowedToPlay", {message: `Cards allowed to play: ${this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay.toString()}`});
            this.io.to(nextPlayerID).emit("yourTurn", {message: "your turn"});
         }


      }
   }  // end of nextPlayer

   /**
    * Hochzeit
    */
   public hochzeit(): void{
      let dreamPartner: Player | null = this.gameController.checkHochzeit();
      if(dreamPartner != null){
         // Notify all players who plays with whom
         this.io.sockets.emit("hochzeit", {message: `${dreamPartner} plays with ${this.gameController.whoHasTwoKreuzQueen}`});
      }else{
         // Notify all players who plays with whom
         this.io.sockets.emit("hochzeit", {message: `${this.gameController.whoHasTwoKreuzQueen} plays alone`});
      }
   }

   /**
    * Send cards on hand to each player
    */
   public sendCardsOnhand(): void{
      for(let i = 0; i < 4; i++){
         this.io.to(this.gameController.playersSetupFactory.playerSocketIDList[i]).emit("cardsOnHand", {message: `Cards on hand: ${this.gameController.playersSetupFactory.players[i].cardsOnHand.toString()}`});
      }
   }


   /**
    * Send round number
    */
   public sendRoundNumber(){
      // Increase first round and send to player
      this.gameController.numbRound++;
      this.io.sockets.emit("roundNumber", {message: `Round ${this.gameController.numbRound}`});
   }


   //region Getter Setter
   get io(): SocketIO.Server {
      return this._io;
   }

   set io(value: SocketIO.Server) {
      this._io = value;
   }

   get playerSocketIDList(): string[] {
      return this._playerSocketIDList;
   }

   set playerSocketIDList(value: string[]) {
      this._playerSocketIDList = value;
   }

   get playerNameList(): string[] {
      return this._playerNameList;
   }

   set playerNameList(value: string[]) {
      this._playerNameList = value;
   }

   get gameController(): GameController {
      return this._gameController;
   }

   set gameController(value: GameController) {
      this._gameController = value;
   }

   get alreadyPlayed(): number {
      return this._alreadyPlayed;
   }

   set alreadyPlayed(value: number) {
      this._alreadyPlayed = value;
   }

//endregion
}

