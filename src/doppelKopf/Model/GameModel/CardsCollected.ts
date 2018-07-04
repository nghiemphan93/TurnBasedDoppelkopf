import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Player} from "../PlayerModel/Player";
import {Card} from "../CardModel/Card";


@Entity()
export class CardsCollected{
   @PrimaryGeneratedColumn()
   public cardsCollectedId: string;

   @ManyToOne(type => Player)
   @JoinColumn({
      name: "playerId",
      referencedColumnName: "playerId"
   })
   public player: Player;

   @ManyToOne(type => Card)
   @JoinColumn({
      name: "cardId",
      referencedColumnName: "cardId"
   })
   public card: Card;


   constructor(player: Player, card: Card) {
      this.player = player;
      this.card = card;
   }
}