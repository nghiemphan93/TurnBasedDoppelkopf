/**
 *     Card Deck creating all cards needed in game and deal to players.
 *
 *     Attribute:
 *
 *     Important Methods:
 *         init():     Initialize all cards needed and shuffle
 *         deal():     Deal cards to all players
 *         shuffle():  Shuffle
 *         reset():    Clear Deck then prepare for new game
 */

import {Player} from "../PlayerModel/Player";
import {Cards} from "./Cards";
import {Suit} from "./Suit";
import {Rank} from "./Rank";
import {Card} from "./Card";
import {CardsOnHand} from "./CardsOnHand";
import {DatabaseProvider} from "../../../DatabaseProvider";

export class CardsToDeal extends Cards{

   //region Constructor
   constructor(players: Array<Player>){
      super();
      this.players = players;
   }
   //endregion

   //region Important methods
   /**
    * Initialize all cards needed and shuffle
    */
   public async init(){
      // Prepare all possible Suits and Ranks
      let suits: Array<string> = Object.keys(Suit);
      let ranks: Array<string> = Object.keys(Rank);
      let cards: Array<Card> = [];

      // Create all possible card combinations from Suits and Ranks
      for(let suit of suits){
         for(let rank of ranks){
            cards.push(new Card(<Suit>suit, <Rank>rank));
            cards.push(new Card(<Suit>suit, <Rank>rank));
         }
      }


      this.addAll(cards);
      this.shuffle();
   }

   /**
    * Deal cards to all players
    */
   public deal(): void{
      // Prepare a Hand for every player
      let cardsToDeal: CardsOnHand = new CardsOnHand();

      // For each player: remove 10 Cards from Deck then transfer to each Hand
      for(let player of this.players){
         for(let i = 0; i<10; i++){
            let temp: Card = this.cards[0];
            this.cards.splice(0, 1);
            temp.belongsToPlayer = player;
            player.cardsOnHand.add(temp);
         }
      }
   }

   /**
    * Shuffle
    */
   public shuffle(): void{
      for (let i = this.cards.length - 1; i > 0; i--) {
         const j = Math.floor(Math.random() * (i + 1));
         [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
      }
   }

   /**
    * Clear Deck then prepare for new game
    */
   public reset(): void{
      this.clear();
      this.init();
   }
   //endregion

}