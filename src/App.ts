import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import express from 'express';
import http from "http";
import socket from "socket.io";
import router from "./routes/Routes";
import {emit} from "cluster";
import {SocketSetup} from "./doppelKopf/SocketSetup";
import {Main} from "./doppelKopf/Main";
import * as path from "path";



export class App {
   private app: express.Application;
   private PORT: number | string;
   private server: http.Server;
   private io: socket.Server;
   private main: Main;

   constructor() {
      this.app = express();
      this.config();

   }

   private config(): void {
      this.listenPort();
      this.io = socket(this.server);
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(express.static("public"));
      this.app.use(express.static("dist/public"));
      this.app.set("view engine", "ejs");
      this.app.set("views", path.join(__dirname, "../views"));
      this.app.use(router);

      // Start the game server
      this.main = new Main(this.io)
   }

   private listenPort(): void{
      // setup PORT
      this.PORT = process.env.PORT || 4000;
      this.server = this.app.listen(this.PORT, () => {
         console.log(`Server started at port ${this.PORT}`);
      });

   }  // end of listenPort
}

























