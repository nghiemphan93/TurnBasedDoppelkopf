/**
 * Initialize players for a game
 *
 * Attribute:
 *     players:        hold reference to all players
 *
 * Important Methods:
 *     init()          prepare sign up for 4 real players
 *     initSeeding():  Auto seeding 4 player for Demo purpose
 *     addPlayer():    Add a player to the Players collection
 */

import {Player} from "../Model/PlayerModel/Player";
import socket from "socket.io";
import {SocketSetup} from "../SocketSetup";
import {GameController} from "./GameController";

export class PlayersSetupFactory{
   //region Attributes
   private _players: Array<Player>;
   private _playerSocketIDList: string[];
   private _io: socket.Server;
   private _socketSetup: SocketSetup;
   private _gameController: GameController;
   //endregion

   //region Constructors
   constructor(socketSetup: SocketSetup, gameController: GameController) {
      this._players = [];
      this._playerSocketIDList = [];
      this.socketSetup = socketSetup;
      this.io = socketSetup.io;
      this.gameController = gameController;
   }
   //endregion

   //region Important methods
   /**
    * Prepare sign up for 4 real players
    */
   public init(): void{
      this.io.on("connection", (clientSocket: any) => {
         clientSocket.on("register", (data: any) => {
            this.socketSetup.register(clientSocket, data, this);
         });

         clientSocket.on("disconnect", () => {
            this.socketSetup.disconnect(clientSocket, this);
         })
      });
   }

   /**
    * Auto seeding 4 player for Demo purpose
    */
   public initSeeding(): void{
      let phan: Player = new Player("Phan", "phan");
      let melanie: Player = new Player("Melanie", "melanie");
      let sebastian: Player = new Player("Sebastian", "sebastian");
      let dominik: Player = new Player("Dominik", "dominik");

      this.addPlayer(phan);
      this.addPlayer(melanie);
      this.addPlayer(sebastian);
      this.addPlayer(dominik);
   }

   /**
    * Add a player to the Players collection
    * @param player
    */
   public addPlayer(player: Player): void{
      this.players.push(player);
   }

   //endregion


   //region Getter Setter
   get players(): Array<Player> {
      return this._players;
   }

   set players(value: Array<Player>) {
      this._players = value;
   }


   get playerSocketIDList(): string[] {
      return this._playerSocketIDList;
   }

   set playerSocketIDList(value: string[]) {
      this._playerSocketIDList = value;
   }


   get io(): SocketIO.Server {
      return this._io;
   }

   set io(value: SocketIO.Server) {
      this._io = value;
   }

   get socketSetup(): SocketSetup {
      return this._socketSetup;
   }

   set socketSetup(value: SocketSetup) {
      this._socketSetup = value;
   }


   get gameController(): GameController {
      return this._gameController;
   }

   set gameController(value: GameController) {
      this._gameController = value;
   }

//endregion
}