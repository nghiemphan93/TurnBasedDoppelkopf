import {Card} from "./Model/CardModel/Card";
import {Suit} from "./Model/CardModel/Suit";
import {Rank} from "./Model/CardModel/Rank";
import {type} from "os";
import {CardsToDeal} from "./Model/CardModel/CardsToDeal";
import {PlayersSetupFactory} from "./Controller/PlayersSetupFactory";
import {CardsSetupFactory} from "./Controller/CardsSetupFactory";


// TEST TEST TEST


let cardsToDeal: CardsToDeal = new CardsToDeal([]);
cardsToDeal.init();


let playersSetupFactory: PlayersSetupFactory = new PlayersSetupFactory();
let cardsSetupFactory: CardsSetupFactory = new CardsSetupFactory(playersSetupFactory);

cardsSetupFactory.initCardSetup();

console.log(cardsSetupFactory.playerSetup.players[0].cardsOnHand.cards.toString());

let card: Card = new Card(Suit.HERZ, Rank.DAMEN);
console.log(card.toString());
