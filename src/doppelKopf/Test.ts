import {Card} from "./Model/CardModel/Card";
import {Suit} from "./Model/CardModel/Suit";
import {Rank} from "./Model/CardModel/Rank";
import {type} from "os";
import {CardsToDeal} from "./Model/CardModel/CardsToDeal";
import {PlayersSetupFactory} from "./Controller/PlayersSetupFactory";
import {CardsSetupFactory} from "./Controller/CardsSetupFactory";
import {GameController} from "./Controller/GameController";
import {SortHelper} from "./Model/CardModel/SortHelper";


// TEST TEST TEST

let game: GameController = new GameController();
game.play();


// for(let i = 1; i<=20; i++){
//    console.log(Math.floor(Math.random()*10));
// }


// let cardsToDeal: CardsToDeal = new CardsToDeal([]);
// cardsToDeal.init();
// SortHelper.sortByStrength(cardsToDeal);
// for(let card of cardsToDeal.cards){
//    console.log(card.strength);
// }
// console.log(cardsToDeal.cards.toString());
//
//
// let playersSetupFactory: PlayersSetupFactory = new PlayersSetupFactory();
// let cardsSetupFactory: CardsSetupFactory = new CardsSetupFactory(playersSetupFactory);
//
// cardsSetupFactory.initCardSetup();
//
// console.log(cardsSetupFactory.playerSetup.players[0].cardsOnHand.cards.toString());
//
// let card: Card = new Card(Suit.HERZ, Rank.DAMEN);
// console.log(card.toString());

