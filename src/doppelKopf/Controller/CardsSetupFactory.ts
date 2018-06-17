/**
 *     Setup all kinds of cards needed for a game (Deck, Hand, Cards won...)
 *
 *  Atribute:
 *     playerSetup:          holding setup infor of 4 players
 *     cardsToDeal:          create deck init
 *     cardsWons:            4 card lists storing STICH for each player
 *     cardsOnHands:         list of 4 card Hands for each players
 *     cardsPlayedPerRound:  cards played on table per round
 *
 *  Important methods:
 *      initCardSetup()               Initialize all types of cards and deal to players
 *      checkPlayerHasKreuzQueen()    Walk through every player and check if the player has Kreuz Queen
 */

import {PlayersSetupFactory} from "./PlayersSetupFactory";
import {CardsToDeal} from "../Model/CardModel/CardsToDeal";
import {CardsWon} from "../Model/CardModel/CardsWon";
import {CardsOnHand} from "../Model/CardModel/CardsOnHand";
import {CardsPlayedPerRound} from "../Model/CardModel/CardsPlayedPerRound";
import {SortHelper} from "../Model/CardModel/SortHelper";

export class CardsSetupFactory{
   //region Attributes
   private _playerSetup: PlayersSetupFactory;
   private _cardsToDeal: CardsToDeal;
   private _cardsWons: Array<CardsWon>;
   private _cardsOnHands: Array<CardsOnHand>;
   private _cardsPlayedPerRound: CardsPlayedPerRound;
   //endregion

   //region Constructor
   constructor(playersSetupFactory: PlayersSetupFactory){
      this.playerSetup = playersSetupFactory;
      this.cardsToDeal = new CardsToDeal(this.playerSetup.players);
      this.cardsWons = [];
      this.cardsOnHands = [];
      this.cardsPlayedPerRound = new CardsPlayedPerRound();
   }
   //endregion

   //region Important methods
/**
 * Initialize all types of cards and deal to players
 */
public initCardSetup(): void{
   // this.playerSetup.initSeeding();
   // this.playerSetup.init();

   // Setup all cards needed
   this.cardsToDeal.init();
   // Deal to players
   this.cardsToDeal.deal();

   // init sort each Hand by strength
   for(let player of this.playerSetup.players){
      SortHelper.sortByStrength(player.cardsOnHand);
   }
}

/**
 * Walk through every player and check if the player has Kreuz Queen
 */
public checkPlayerHasKreuzQueen(): void{
   // check every player
   for(let player of this.playerSetup.players){
      // check every card on hand
      for(let card of player.cardsOnHand.cards){
         if(card.getName().localeCompare("KREUZ DAMEN") == 0){
            player.hasKreuzQueen = true;
            break;
         }

      }
   }
}   // end of checkPlayerHasKreuzQueen
//endregion


   //region Getter Setter
   get playerSetup(): PlayersSetupFactory {
      return this._playerSetup;
   }

   set playerSetup(value: PlayersSetupFactory) {
      this._playerSetup = value;
   }

   get cardsToDeal(): CardsToDeal {
      return this._cardsToDeal;
   }

   set cardsToDeal(value: CardsToDeal) {
      this._cardsToDeal = value;
   }

   get cardsWons(): Array<CardsWon> {
      return this._cardsWons;
   }

   set cardsWons(value: Array<CardsWon>) {
      this._cardsWons = value;
   }

   get cardsOnHands(): Array<CardsOnHand> {
      return this._cardsOnHands;
   }

   set cardsOnHands(value: Array<CardsOnHand>) {
      this._cardsOnHands = value;
   }

   get cardsPlayedPerRound(): CardsPlayedPerRound {
      return this._cardsPlayedPerRound;
   }

   set cardsPlayedPerRound(value: CardsPlayedPerRound) {
      this._cardsPlayedPerRound = value;
   }
   //endregion
}