/**
 *     Help interface for sorting all cards classes
 *
 *     Attribute:
 *
 *     Important Methods:
 *         sortBySuit():    Sort the card list by SUIT
 *         sortByRank():    Sort the card list by RANK
 *         sortByFehl():    Sort the card list by FEHL
 *         sortByTrumpf():  Sort the card list by TRUMPF
 *         sortByStrength():Sort the card list by STRENGTH
 *         sortByPoint():   Sort the card list by POINT
 */

import {Cards} from "./Cards";

export class SortHelper {
   //region Important methods
   /**
    * Sort the card list by SUIT
    * @param cards
    */
   public static sortBySuit(cards: Cards): void {
      cards.cards.sort((card1, card2) => card1.suit.localeCompare(card2.suit));
   }

   /**
    * Sort the card list by RANK
    * @param cards
    */
   public static sortByRank(cards: Cards): void {
      cards.cards.sort((card1, card2) => card1.rank.localeCompare(card2.rank));
   }

   /**
    * Sort the card list by FEHL
    * @param cards
    */
   public static sortByFehl(cards: Cards): void {
      cards.cards.sort((card2, card1) =>
         card1.isFehl.toString().localeCompare(card2.isFehl.toString()));
   }

   /**
    * Sort the card list by TRUMPF
    * @param cards
    */
   public static sortByTrumpf(cards: Cards): void {
      cards.cards.sort((card2, card1) =>
         card1.isTrumpf.toString().localeCompare(card2.isTrumpf.toString()));
   }

   /**
    * Sort the card list by STRENGTH
    * @param cards
    */
   public static sortByStrength(cards: Cards): void {
      cards.cards.sort((card2, card1) => card1.strength.localeCompare(card2.strength));
   }

   /**
    * Sort the card list by POINT
    * @param cards
    */
   public static sortByPoint(cards: Cards): void {
      cards.cards.sort((card1, card2) => card1.point - card2.point);
   }

//endregion
}