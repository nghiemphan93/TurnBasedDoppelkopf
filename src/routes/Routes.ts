import * as CircularJSON from "circular-json";
import {Connection, FieldInfo, MysqlError, Pool} from "mysql";
import express, {Request, Response} from "express";
import mysql from "mysql";
import {CardsOnHand} from "../doppelKopf/Model/CardModel/CardsOnHand";
import {CardsToDeal} from "../doppelKopf/Model/CardModel/CardsToDeal";
import {SortHelper} from "../doppelKopf/Model/CardModel/SortHelper";
import {DatabaseProvider} from "../DatabaseProvider";
import {Card} from "../doppelKopf/Model/CardModel/Card";
import {Player} from "../doppelKopf/Model/PlayerModel/Player";
import {CardsPlayedPerRound} from "../doppelKopf/Model/CardModel/CardsPlayedPerRound";
import {PlayersSetupFactory} from "../doppelKopf/Controller/PlayersSetupFactory";
import {SocketSetup} from "../doppelKopf/SocketSetup";
import {GameController} from "../doppelKopf/Controller/GameController";
import {Game} from "../doppelKopf/Model/GameModel/Game";
import {GamesPlayed} from "../doppelKopf/Model/GameModel/GamesPlayed";
import {createQueryBuilder} from "typeorm";

class Routes {
   public router = express.Router();

   public constructor() {
      this.setUpUserRoutes();
   }

   private setUpUserRoutes(): void {
      // root
      this.router.get("/", (req: Request, res: Response) => {
         res.render("home");
      });

      // show form
      this.router.get("/form", (req: Request, res: Response) => {
         res.render("form");
      });

      // show form
      this.router.get("/createCards", async (req: Request, res: Response) => {
         let cardsToDeal = new CardsToDeal([]);
         cardsToDeal.init();
         SortHelper.sortByStrength(cardsToDeal);

         cardsToDeal.cards.forEach(async (card) => {
            const connection = await DatabaseProvider.setupConnection();
            await connection.getRepository(Card).save(card);
         });

         console.log(cardsToDeal.cards.toString());

         // let player: Player = new Player("john", "doe");
         // const connection = await DatabaseProvider.setupConnection();
         // await connection.getRepository(Player).save(player);



         res.send(cardsToDeal.cards.toString());
      });

      // API AJAX
      this.router.get("/game", async (req: Request, res: Response) => {
         const connection = await DatabaseProvider.setupConnection();

         let gamesPlayed = await connection.getRepository(GamesPlayed).find({
            relations : ["player", "partnerInGame", "game"],
            where: {playerId: 1}
         });

         res.send(CircularJSON.stringify(gamesPlayed));
      });
   }  // end of setUpUserRoutes
}

export default new Routes().router;