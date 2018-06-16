/**
 *     Hand of each player
 *
 *     Attribute:
 *         fehl:       List holding all FEHL
 *         strumpf:    List holding all STRUMPF
 *
 *     Important Methods:
 */

import {Cards} from "./Cards";
import {Card} from "./Card";

export class CardsOnHand extends Cards{
   //region Attributes
   private _fehl: Array<Card> = this.filterFehl();
   private _trumpf: Array<Card>  = this.filterTrumpf();
   //endregion

   //region Methods
   public toString(): string {
      let result: string = "";

      for(let i = 0; i<this.cards.length; i++){
         let card: Card = this.cards[i];
         result += `${card} `;
      }

      return result;
   }
   //endregion

   //region Getter Setter
   get fehl(): Array<Card> {
      return this._fehl;
   }

   set fehl(value: Array<Card>) {
      this._fehl = value;
   }

   get trumpf(): Array<Card> {
      return this._trumpf;
   }

   set trumpf(value: Array<Card>) {
      this._trumpf = value;
   }
   //endregion
}