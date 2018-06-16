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

export class PlayersSetupFactory{
   //region Attributes
   private _players: Array<Player>;
   //endregion

   //region Constructors
   constructor() {
      this._players = [];
   }
   //endregion

   //region Important methods
   /**
    * Prepare sign up for 4 real players
    */
   public init(): void{

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
   //endregion
}