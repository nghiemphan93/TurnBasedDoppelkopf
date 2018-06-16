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
   public remove(indexOrCard: number | Card | null): Card | null{
      if(typeof (indexOrCard) == "number"){
         let index = indexOrCard;
         let temp: Card = this.cards[index];
         this.cards.splice(index, 1);
         this.numCards--;
         return temp;
      }else{
         let index: number = this.cards.indexOf(<Card>indexOrCard);
         if(index >= 0){
            this.cards.splice(index, 1);
            this.numCards--;

            return indexOrCard;
         }else{
            return null;
         }
      }
   }  // end of remove


   /**
    * Clear all the cards from the card list
    */
   public clear(): void {
      this.cards.splice(0, this.numCards-1);
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

   get players(): Player[] {
      return this._players;
   }

   set players(value: Player[]) {
      this._players = value;
   }

   //endregion


}