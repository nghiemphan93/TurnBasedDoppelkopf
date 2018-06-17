/**
 * Store the list of allowed to play cards
 *  which were checked in setWhatCardToPlay() in Class Player
 *
 */

import {Cards} from "./Cards";
import {Card} from "./Card";

export class CardsAllowedToPlay extends Cards{
   //region Methods
   public toString(): string {
      let result: string = "";

      for(let i = 0; i<this.cards.length; i++){
         let card: Card = this.cards[i];
         result += `${i}${card} `;
      }

      return result;
   }
   //endregion
}