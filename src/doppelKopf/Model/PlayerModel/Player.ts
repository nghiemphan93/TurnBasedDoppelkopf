/**
 * Class for each player who takes part in the game
 *
 * Attribute:
 *      name:                   name
 *      password:               password
 *      cardsOnHand:            cards on hand
 *      cardsWon:               cards were collected
 *      cardsPlayedPerRound:    cards played on table each round
 *      cardsAllowedToPlay      cards allowed to play(bedienen)
 *      pointsWonPerGame        all points of each game
 *      hasKreuzQueen :         if the player has the Kreuz Queen or not, used to determine
 *      specialPoints:          special points won by Bazinga
 *      allowedToGuessBazinga:  true/false representing allowed to guess Bazinga or not
 *      gameWon:                won the game or not
 *      partner:                who was the partner in the game
 *
 *  Important methods:
 *      playACard():            Play a chosen card
 *      playARandomCard():      Play a random card, used for DEMO
 *      setWhatCardToPlay():    Check and determine what cards on Hand are allowed to play, depending on the first card was played
 *      calcPointsWonPerGame(): Calculation of points won per game
 *      guessBazinga():         Attempt to guess Bazinga
 *                              Allowed to guess only once per Game
 *                              if correct, receives 10 Special Points
 *                              if not, loses 5 Points
 *
 */

import {CardsOnHand} from "../CardModel/CardsOnHand";
import {CardsWon} from "../CardModel/CardsWon";
import {CardsPlayedPerRound} from "../CardModel/CardsPlayedPerRound";
import {CardsAllowedToPlay} from "../CardModel/CardsAllowedToPlay";
import {Card} from "../CardModel/Card";

export class Player {
   //region Attributes
   private _name: string;
   private _password: string;
   private _cardsOnHand: CardsOnHand;
   private _cardsWon: CardsWon;
   private _cardsPlayedPerRound: CardsPlayedPerRound;
   private _cardsAllowedToPlay: CardsAllowedToPlay;
   private _pointsWonPerGame: number = 0;
   private _hasKreuzQueen: boolean = false;
   private _specialPoints: number = 0;
   private _allowedToGuessBazinga: boolean = true;
   private _gameWon: boolean;
   private _partner: Player | null;
   //endregion

   //region Constructor
   constructor(name: string, password: string) {
      this._name = name;
      this._password = password;
      this._cardsOnHand = new CardsOnHand();
      this._cardsWon = new CardsWon();
      this._cardsPlayedPerRound = new CardsPlayedPerRound();
      this._cardsAllowedToPlay = new CardsAllowedToPlay();
      this._gameWon = false;
      this._partner = null;
   }

   //endregion

   //region Important methods
   /**
    * Play a chosen card
    * @param index
    * @return
    */
   public playACard(index: number): Card {
      let card: Card = <Card>this.cardsOnHand.remove(index);
      return card;
   }

   /**
    * Play a random card, used for DEMO
    * @return
    */
   public playARandomCard(): number | Card | null {
      let card: number | Card | null = null;

      // if there's still at least 1 Card in CardsAllowedToPlay
      if (this.cardsAllowedToPlay.numCards >= 0) {
         card = this.cardsAllowedToPlay.remove(Math.random() * this.cardsAllowedToPlay.numCards);
         this.cardsOnHand.remove(card);
      }

      return card;
   }

   /**
    * Check and determine what cards on Hand are allowed to play
    * depending on the first card was played
    * @param firstCardPlayed
    */
   public setWhatCardToPlay(firstCardPlayed: Card): void {
      let cardsToPlayReturn: Array<Card> = [];

      // check if the first Card in CardsPlayedPerRound Fehl or Trumpf
      if (firstCardPlayed.isFehl) {
         // The first card was played is FEHL

         // check if the player's Hand had the same FEHL color => bedienen
         // if not, then play whatever
         let hasSameFehl: boolean = false;
         for (let card of this.cardsOnHand.cards) {
            // if it's the same FEHL color, then add to CardsToPlay
            // set hasSameFehl = true
            // FEHL's STRENGTH has the same first Letter: 1 or 2 or 3
            if (card.strength.charAt(0) == firstCardPlayed.strength.charAt(0)) {
               cardsToPlayReturn.push(card);
               hasSameFehl = true;
            }
         }

         // if the Hand has the same FEHL color
         // then return CardsToPlay containing all same FEHL color cards
         if (hasSameFehl == true) {
            this.cardsAllowedToPlay.clear();
            this.cardsAllowedToPlay.addAll(cardsToPlayReturn);
         } else {
            // if Hand doesn't contain any same FEHL color
            // return everthing from the Hand
            this.cardsAllowedToPlay.clear();
            this.cardsAllowedToPlay.addAll(this.cardsOnHand.cards);
         }

      } else {
         // The first card was played is TRUMPF

         // if Hand contains any TRUMPF
         // then return every TRUMPF
         // otherwise return everything from Hand
         let hasTrumpf: boolean = false;
         for (let card of this.cardsOnHand.cards) {
            // TRUMPF's STRENGTH begins with 4 or 5 or 6 or 7
            if (card.strength.charAt(0) >= '4') {
               cardsToPlayReturn.push(card);
               hasTrumpf = true;
            }
         }

         if (hasTrumpf == true) {
            // return all TRUMPF
            this.cardsAllowedToPlay.clear();
            this.cardsAllowedToPlay.addAll(cardsToPlayReturn);
         } else {
            // return everything from HAND
            this.cardsAllowedToPlay.clear();
            this.cardsAllowedToPlay.addAll(this.cardsOnHand.cards);
         }

      }
   }   // end of checkWhatCardToPlay()

   /**
    * Calculation of points won per game
    * @return
    */
   public calcPointsWonPerGame(): number {
      let sum: number = 0;
      for (let card of this.cardsWon.cards) {
         sum += card.point;
      }

      // add bonus points
      sum += this.specialPoints;

      this.pointsWonPerGame = sum;

      return sum;
   }

   /**
    * Attempt to guess Bazinga
    * Allowed to guess only once per Game
    * if correct, receives 10 Special Points
    * if not, loses 5 Points
    * @return
    */
   public guessBazinga(): boolean {
      if (this.allowedToGuessBazinga == true) {
         this.allowedToGuessBazinga = false;
         return true;
      } else {
         return false;
      }
   }   // end of guessBazinga

   public toString(): string {
      return this.name.toUpperCase();
   }

//endregion

   //region Getter Setter
   get name(): string {
      return this._name;
   }

   set name(value: string) {
      this._name = value;
   }

   get password(): string {
      return this._password;
   }

   set password(value: string) {
      this._password = value;
   }

   get cardsOnHand(): CardsOnHand {
      return this._cardsOnHand;
   }

   set cardsOnHand(value: CardsOnHand) {
      this._cardsOnHand = value;
   }

   get cardsWon(): CardsWon {
      return this._cardsWon;
   }

   set cardsWon(value: CardsWon) {
      this._cardsWon = value;
   }

   get cardsPlayedPerRound(): CardsPlayedPerRound {
      return this._cardsPlayedPerRound;
   }

   set cardsPlayedPerRound(value: CardsPlayedPerRound) {
      this._cardsPlayedPerRound = value;
   }

   get cardsAllowedToPlay(): CardsAllowedToPlay {
      return this._cardsAllowedToPlay;
   }

   set cardsAllowedToPlay(value: CardsAllowedToPlay) {
      this._cardsAllowedToPlay = value;
   }

   get pointsWonPerGame(): number {
      return this._pointsWonPerGame;
   }

   set pointsWonPerGame(value: number) {
      this._pointsWonPerGame = value;
   }

   get hasKreuzQueen(): boolean {
      return this._hasKreuzQueen;
   }

   set hasKreuzQueen(value: boolean) {
      this._hasKreuzQueen = value;
   }

   get specialPoints(): number {
      return this._specialPoints;
   }

   set specialPoints(value: number) {
      this._specialPoints = value;
   }

   get allowedToGuessBazinga(): boolean {
      return this._allowedToGuessBazinga;
   }

   set allowedToGuessBazinga(value: boolean) {
      this._allowedToGuessBazinga = value;
   }

   get gameWon(): boolean {
      return this._gameWon;
   }

   set gameWon(value: boolean) {
      this._gameWon = value;
   }

   get partner(): Player | null {
      return this._partner;
   }

   set partner(value: Player | null) {
      this._partner = value;
   }

   //endregion
}