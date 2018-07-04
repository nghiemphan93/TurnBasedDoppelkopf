import {Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Player} from "../PlayerModel/Player";

@Entity()
export class Game{
   @PrimaryGeneratedColumn()
   public gameId: string;

   @ManyToOne(type => Player)
   @JoinColumn({
      name: "player1_Id",
      referencedColumnName: "playerId"
   })
   public player1: Player;

   @ManyToOne(type => Player)
   @JoinColumn({
      name: "player2_Id",
      referencedColumnName: "playerId"
   })
   public player2: Player;

   @ManyToOne(type => Player)
   @JoinColumn({
      name: "player3_Id",
      referencedColumnName: "playerId"
   })
   public player3: Player;

   @ManyToOne(type => Player)
   @JoinColumn({
      name: "player4_Id",
      referencedColumnName: "playerId"
   })
   public player4: Player;


   constructor(player1: Player, player2: Player, player3: Player, player4: Player) {
      this.player1 = player1;
      this.player2 = player2;
      this.player3 = player3;
      this.player4 = player4;
   }
}