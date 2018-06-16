/**
 * Base Card Collection for CardsOnHand, CardsPlayedPerRound, CardsToDeal, CardsWon, CardsAllowedToPlay
 *
 * Attribute:
 *     cards:           List storing all cards depending on purpose (deck, hand, Stich, cards won...)
 *     numCards:        Number of cards at particular moment
 *     players:         Keep references to Players
 *
 * Important Methods:
 *     add, addAll, remove, clear:  Manipulate elements in the collection
 *     filterFehl():                Filter all the FEHL in the card list
 *     filterTrumpf():              Filter all the TRUMPF in the card list
 *     display():                   Print out all Cards to ConsoleView
 */

import {Card} from "./Card";
import {Player} from "../PlayerModel/Player";

export abstract class Cards {
   //region Attributes
   private _cards: Array<Card>;
   private _numCards: number;
   private _players: Array<Player>;
   //endregion

   //region Constructors
   constructor () {
      this.cards = [];
      this.players = [];
      this._numCards = 0;
   }
   //endregion

   //region Important methods
   /**
    * Add a card to the card list
    * @param card
    * @return
    */
   public add(card: Card): Card {
      this.cards.push(card);
      this.numCards++;

      return card;
   }

   /**
    * Add a bunch of cards to the card list
    * @param cards
    */
   public addAll(cards: Array<Card>): void {
      this.cards.push(...cards);

      this.numCards += cards.length;
   }

   /**
    * Remove a card from the cards list given a index or the card itself
    * @param {number | Card} indexOrCard
    * @returns {Card | null}
    */
   public remove(indexOrCard: number | Card): Card{
      if(typeof (indexOrCard) == "number"){
         let index = indexOrCard;
         let temp: Card = this.cards[index];
         this.cards.splice(index, 1);
         this.numCards--;
         return temp;
      }else{
         let index: number = this.cards.indexOf(<Card>indexOrCard);
         this.cards.splice(index, 1);
         this.numCards--;

         return indexOrCard;
      }
   }  // end of remove


   /**
    * Clear all the cards from the card list
    */
   public clear(): void {
      this.cards.splice(0, this.numCards);
      this.numCards = 0;
   }

   /**
    * Filter all the FEHL in the card list
    */
   public filterFehl(): Array<Card>{
      let resultList: Array<Card> = [];

      // walk through all Cards and check out the FEHL ones
      for(let card of this.cards){
         if(card.isFehl){
            resultList.push(card);
         }
      }

      return resultList;
   }

   /**
    * Filter all the TRUMPF in the card list
    */
   public filterTrumpf(): Array<Card>{
      let resultList: Array<Card> = [];

      // walk through all Cards and copy the one which is not in FEHL list
      for(let card of this.cards){
         if(card.isTrumpf){
            resultList.push(card);
         }
      }

      return resultList;
   }

   /**
    * Print out all Cards to ConsoleView
    */
   public display(): void{
      for (let card of this.cards) {
         console.log(card);
      }
      console.log();
   }

   public toString(): string {
      let result: string = "";

      for (let card of this.cards) {
         result += card + " ";
      }
      return result;
   }
   //endregion





   //region Getter Setter
   get cards(): Card[] {
      return this._cards;
   }

   set cards(value: Card[]) {
      this._cards = value;
   }

   get numCards(): number {
      return this._numCards;
   }

   set numCards(value: number) {
      this._numCards = value;
   }

   get players(): Player[]{
      return this._players;
   }

   set players(value: Player[]) {
      this._players = value;
   }

   //endregion


}