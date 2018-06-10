import {Connection, FieldInfo, MysqlError, Pool} from "mysql";
import express, {Request, Response} from "express";
import mysql from "mysql";

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
   }  // end of setUpUserRoutes
}

export default new Routes().router;