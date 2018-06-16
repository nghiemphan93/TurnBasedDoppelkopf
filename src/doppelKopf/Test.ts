import {Card} from "./Model/CardModel/Card";
import {Suit} from "./Model/CardModel/Suit";
import {Rank} from "./Model/CardModel/Rank";
import {type} from "os";


let card: Card = new Card(Suit.HERZ, Rank.ASS);

console.log(card);

console.log(card.rank);


let array: Array<number> = [5,6,4,8];

for(let temp of array){
   console.log(temp);
}