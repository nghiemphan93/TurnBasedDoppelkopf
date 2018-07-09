import socket from "socket.io";
import {PlayersSetupFactory} from "./Controller/PlayersSetupFactory";
import {Player} from "./Model/PlayerModel/Player";
import {GameController} from "./Controller/GameController";
import {Card} from "./Model/CardModel/Card";
import {SortHelper} from "./Model/CardModel/SortHelper";
import {DatabaseProvider} from "../DatabaseProvider";
import {GamesPlayed} from "./Model/GameModel/GamesPlayed";
import {Game} from "./Model/GameModel/Game";
import {CardsPlayed} from "./Model/GameModel/CardsPlayed";
import {CardsCollected} from "./Model/GameModel/CardsCollected";
import * as CircularJSON from "circular-json";

export class SocketSetup {
   private _io: socket.Server;
   private _playerSocketIDList: string[] = [];
   private _playerNameList: string[] = [];
   private _gameController: GameController;
   private _alreadyPlayed: number = 0;

   constructor(io: socket.Server, gameController: GameController) {
      this._io = io;
      this.gameController = gameController;
      this.main();
   }

   public main(): void {
      this.listenSocketEvents();
   }

   /**
    * Listen to socket events from clients
    */
   public listenSocketEvents(): void {
      // listen when connected
      this._io.on("connection", async (clientSocket: any) => {
         // listen when played a card
         clientSocket.on("playCard", async (data: any) => {
            let playerIndex: number = this.gameController.playersSetupFactory.playerSocketIDList.indexOf(clientSocket.id);
            let card: Card = this.gameController.playersSetupFactory.players[playerIndex].cardsOnHand.cards[data.message];
            this.gameController.playersSetupFactory.players[playerIndex].cardsOnHand.remove(card);
            console.log(card.toString());

            // Save the card to Database for the player
            const connection = await DatabaseProvider.setupConnection();
            let player = this.gameController.playersSetupFactory.players[playerIndex];
            let playerFromDatabase = await connection.getRepository(Player).findOne(player);
            let cardFromDatabase = await connection.getRepository(Card).findOne(card);

            if (playerFromDatabase && cardFromDatabase) {
               let cardPlayed = new CardsPlayed(playerFromDatabase, cardFromDatabase);
               await connection.getRepository(CardsPlayed).save(cardPlayed);
               console.log(player.toString() + " played " + cardPlayed.toString());
            }


            // Save the card to cardsPlayedPerRound
            this.gameController.cardsSetupFactory.cardsPlayedPerRound.add(card);

            // Notify all players
            this.io.sockets.emit("playCard", {card: CircularJSON.stringify(cardFromDatabase)});

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
   public async register(clientSocket: any, data: any) {
      // Add new player to PlayerNameList and PlayerSocketIDList
      console.log(`Welcome ${data.userName}`);
      this.gameController.playersSetupFactory.playerSocketIDList.push(clientSocket.id);
      let player = new Player(data.userName, "");


      // Save the player to database
      const connection = await DatabaseProvider.setupConnection();
      let playerFromDatabase: Player | undefined = await connection.getRepository(Player).findOne(player);

      if (playerFromDatabase === undefined) {
         await connection.getRepository(Player).save(player);
         this.gameController.playersSetupFactory.players.push(player);
      } else {
         this.gameController.playersSetupFactory.players.push(playerFromDatabase);
      }

      console.log(this.gameController.playersSetupFactory.players.toString());
      console.log(this.gameController.playersSetupFactory.playerSocketIDList.toString());
      console.log();


      // Send back a message to the client to confirm registered
      clientSocket.emit("registerSuccess", {
         player
      });

      // Send back a message to all clients to display players
      this.io.sockets.emit("playerList", {
         players: this.gameController.playersSetupFactory.players
      });


      // Check if there's already 4 players
      if (this.gameController.playersSetupFactory.players.length == 4) {
         // Setup cards
         this.gameController.initGame();

         // Send message start game to all players
         this.io.sockets.emit("startGameSeeding", {message: "game started ♥10"});

         // Send round number to all players
         this.sendRoundNumber();

         // Send cards on hand to each player
         this.sendCardsOnhand();

         // Enable next turn button for the 1. player
         this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay.addAll(this.gameController.playersSetupFactory.players[0].cardsOnHand.cards);
         this.io.to(this.gameController.playersSetupFactory.playerSocketIDList[0]).emit("cardsAllowedToPlay", {cardsAllowedToPlay: CircularJSON.stringify(this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay)});
         let nextPlayerName = this.gameController.playersSetupFactory.players[0].name;
         this.io.to(this.gameController.playersSetupFactory.playerSocketIDList[0]).emit("yourTurn", {player: this.gameController.playersSetupFactory.players[0]});

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
   public disconnect(clientSocket: any) {
      let index: number = this.gameController.playersSetupFactory.playerSocketIDList.indexOf(clientSocket.id);

      if (index >= 0) {
         console.log(this.gameController.playersSetupFactory.players[index] + " disconnected");
         this.gameController.playersSetupFactory.playerSocketIDList.splice(index, 1);
         this.gameController.playersSetupFactory.players.splice(index, 1);
      }

      // Print out the player's list
      console.log(this.gameController.playersSetupFactory.players);
      console.log(this.gameController.playersSetupFactory.playerSocketIDList);
      console.log();
   }

   /**
    * Next turn
    * @param clientSocket
    * @param {PlayersSetupFactory} this.gameController.cardsSetupFactory
    */
   public nextTurn(clientSocket: any, data: any) {
      let index: number = this.gameController.playersSetupFactory.playerSocketIDList.indexOf(clientSocket.id);
      this.nextPlayer(index);
   }

   /**
    * Notify the next player who plays the next card
    * @param {number} index
    */
   public async nextPlayer(index: number) {
      // if the round is not yet finished
      if (index < this.gameController.playersSetupFactory.playerSocketIDList.length - 1) {
         // Determine what cards next player allowed to play
         this.gameController.playersSetupFactory.players[index + 1].cardsAllowedToPlay.clear();
         this.gameController.playersSetupFactory.players[index + 1].setWhatCardToPlay(this.gameController.cardsSetupFactory.cardsPlayedPerRound.cards[0]);


         let nextPlayerID: string = this.gameController.playersSetupFactory.playerSocketIDList[index + 1];

         // Send cards allowed to play to the next player
         this.io.to(nextPlayerID).emit("cardsAllowedToPlay", {cardsAllowedToPlay: CircularJSON.stringify(this.gameController.playersSetupFactory.players[index + 1].cardsAllowedToPlay)});
         let nextPlayer = this.gameController.playersSetupFactory.players[index+1];
         this.io.to(nextPlayerID).emit("yourTurn", {player: nextPlayer});
      } else {
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


         // Send results of the round
         this.io.sockets.emit("roundResults", {
            winner: CircularJSON.stringify(roundWinner),
            cardWon: CircularJSON.stringify(cardsPerRound[0])
         });
         console.log(roundWinner + " won the round with " + cardsPerRound[0]);


         // clear the CardsPlayedPerRound
         this.gameController.cardsSetupFactory.cardsPlayedPerRound.clear();

         for (let player of this.gameController.playersSetupFactory.players) {
            player.cardsAllowedToPlay.clear();
         }

         // until round 4, check Hochzeit for the first three rounds
         if (this.gameController.numbRound == 4 && this.gameController.whoHasTwoKreuzQueen != null) {
            let dreamPartner: Player | null = this.gameController.checkHochzeit();
            if (dreamPartner != null) {
               // Send Hochzeit to all players
               this.io.sockets.emit("hochzeit", {message: `Hochzeit: ${dreamPartner.toString()} plays with ${this.gameController.whoHasTwoKreuzQueen}`});
            } else {
               // Send Hochzeit to all players
               this.io.sockets.emit("hochzeit", {message: `Hochzeit: ${this.gameController.whoHasTwoKreuzQueen} plays alone `});
            }
         }

         // Check if game over or not
         if (this.gameController.numbRound == 4) {
            // if Game Over
            this.io.sockets.emit("gameOver", {message: `Game Over`});

            // Send all cards each player collected
            let cardsWon: string = "";
            let pointsWon: string = "";
            for (let player of this.gameController.playersSetupFactory.players) {
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
            if (this.gameController.whichTeamWon() > 0) {
               whichTeamWins += `Team Kreuz Queen wins`;
            } else {
               whichTeamWins += `Team No Kreuz Queen wins`;
            }
            this.io.sockets.emit("whichTeamWins", {message: `${whichTeamWins}`});

            // set game won for each player
            this.gameController.setGameWonEachPlayer();

            // setPartner
            this.gameController.setPartner();


            // Save cards collected to Database to all players
            const connection = await DatabaseProvider.setupConnection();

            let players: Array<Player> = this.gameController.playersSetupFactory.players;

            let game: Game = new Game(players[0], players[1], players[2], players[3]);

            // Save Game
            console.log("what the hell");

            await connection.getRepository(Game).save(game);

            console.log("saved game");


            players.forEach(async player => {
               // save Game Played
               let gamesPlayed: GamesPlayed = new GamesPlayed(player.hasKreuzQueen, player.gameWon, player.pointsWonPerGame, player, player.partner, game);
               await connection.getRepository(GamesPlayed).save(gamesPlayed);

               // save Cards Collected
               player.cardsWon.cards.forEach(async card => {
                  let cardFromDatabase = await connection.getRepository(Card).findOne(card);
                  if(cardFromDatabase){
                     let cardCollected = new CardsCollected(player, cardFromDatabase);
                     await connection.getRepository(CardsCollected).save(cardCollected);
                  }
               });
            });

            console.log("cai lon gi vay");


         } else {
            // If game not yet over
            // rearrange the order of players for next round
            // winner of the last round begins the next round
            for (let i = 0; i < this.gameController.playersSetupFactory.players.length; i++) {
               let player: Player = this.gameController.playersSetupFactory.players[0];
               let playerSocketID: string = this.gameController.playersSetupFactory.playerSocketIDList[0];

               if (player.toString().localeCompare(roundWinner.toString()) == 0) {
                  // if the first position is the round winner, stop
                  break;
               } else {
                  // add the first player to the end of the players list
                  this.gameController.playersSetupFactory.players.push(player);
                  this.gameController.playersSetupFactory.playerSocketIDList.push(playerSocketID);

                  // remove the first player from the player list
                  this.gameController.playersSetupFactory.players.splice(0, 1);
                  this.gameController.playersSetupFactory.playerSocketIDList.splice(0, 1);
               }
            }  // end of for

            // Create new round
            this.sendRoundNumber();
            this.sendCardsOnhand();
            this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay.addAll(this.gameController.playersSetupFactory.players[0].cardsOnHand.cards);

            let nextPlayerID: string = this.gameController.playersSetupFactory.playerSocketIDList[0];
            let nextPlayerName = this.gameController.playersSetupFactory.players[0].name;
            this.io.to(nextPlayerID).emit("cardsAllowedToPlay", {cardsAllowedToPlay: CircularJSON.stringify(this.gameController.playersSetupFactory.players[0].cardsAllowedToPlay)});
            this.io.to(nextPlayerID).emit("yourTurn", {playerName: nextPlayerName});
         }


      }
   }  // end of nextPlayer

   /**
    * Hochzeit
    */
   public hochzeit(): void {
      let dreamPartner: Player | null = this.gameController.checkHochzeit();
      if (dreamPartner != null) {
         // Notify all players who plays with whom
         this.io.sockets.emit("hochzeit", {message: `${dreamPartner} plays with ${this.gameController.whoHasTwoKreuzQueen}`});
      } else {
         // Notify all players who plays with whom
         this.io.sockets.emit("hochzeit", {message: `${this.gameController.whoHasTwoKreuzQueen} plays alone`});
      }
   }

   /**
    * Send cards on hand to each player
    */
   public sendCardsOnhand(): void {
      for (let i = 0; i < 4; i++) {
         this.io.to(this.gameController.playersSetupFactory.playerSocketIDList[i]).emit("cardsOnHand", {cardsOnHand: CircularJSON.stringify(this.gameController.playersSetupFactory.players[i].cardsOnHand)});
      }
   }


   /**
    * Send round number
    */
   public sendRoundNumber() {
      // Increase first round and send to player
      this.gameController.numbRound++;

      this.io.sockets.emit("roundNumber", {roundNumber: `Round ${this.gameController.numbRound}`});
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
