import {Cards} from "./Cards";
import {Card} from "./Card";

export class CardsAllowedToPlay extends Cards{
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
}