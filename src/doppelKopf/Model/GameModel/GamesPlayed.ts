import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Player} from "../PlayerModel/Player";
import {Game} from "./Game";


@Entity()
export class GamesPlayed{
   @PrimaryGeneratedColumn()
   public gamesPlayedId: string;

   @Column({
      type: "tinyint",
   })
   public hadKreuzQueen: boolean;

   @Column({
      type: "tinyint",
   })
   public wonOrNot: boolean;

   @Column()
   public pointsWonInGame: number;

   @ManyToOne(type => Player, {onDelete: "CASCADE"})
   @JoinColumn({
      name: "playerId",
      referencedColumnName: "playerId"
   })
   public player: Player;

   @ManyToOne(type => Player, {onDelete: "CASCADE"})
   @JoinColumn({
      name: "partnerId",
      referencedColumnName: "playerId"
   })
   public partnerInGame: Player | null;

   @ManyToOne(type => Game, {onDelete: "CASCADE"})
   @JoinColumn({
      name: "gameId",
      referencedColumnName: "gameId"
   })
   public game: Game;


   constructor(hadKreuzQueen: boolean, wonOrNot: boolean, pointsWonInGame: number, player: Player, partnerInGame: Player | null, game: Game) {
      this.hadKreuzQueen = hadKreuzQueen;
      this.wonOrNot = wonOrNot;
      this.pointsWonInGame = pointsWonInGame;
      this.player = player;
      this.partnerInGame = partnerInGame;
      this.game = game;
   }
}