import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import express from 'express';
import http from "http";
import socket from "socket.io";
import router from "./routes/Routes";
import {emit} from "cluster";
import MainTest from "./doppelKopf/MainTest";



class App {
   public app: express.Application;
   public PORT: number | string;
   public server: http.Server;
   public io: socket.Server;
   public userSocketIDList: string[] = [];
   public userNameList: string[] = [];

   constructor() {
      this.app = express();
      this.config();
      this.listenSocketEvents();
      this.simulateTurnBased();
   }

   private config(): void {
      this.listenPort();
      this.io = socket(this.server);
      this.app.use(bodyParser.json());
      this.app.use(bodyParser.urlencoded({ extended: false }));
      this.app.use(express.static("public"));
      this.app.use(express.static("dist/public"));
      this.app.set("view engine", "ejs");
      this.app.use(router);
   }

   private listenPort(): void{
      // setup PORT
      this.PORT = process.env.PORT || 3000;
      this.server = this.app.listen(this.PORT, () => {
         console.log(`Server started at port ${this.PORT}`);
      });

   }  // end of listenPort

   private listenSocketEvents(): void{
      // listen when connected
      this.io.on("connection", (clientSocket: any) => {
         console.log(`${clientSocket.id} made socket connection `);
         console.log(this.userSocketIDList.length + " register");
         console.log("\n");

         // listen to register player's name
         clientSocket.on("register", (data: any) => {
            let index = this.userNameList.indexOf(data.userName);
            if( index >= 0){
               // if name existed
               console.log(`${data.userName} replace`);
               this.userSocketIDList.splice(index, 1, clientSocket.id);
               console.log(this.userNameList);
               console.log(this.userSocketIDList);
               console.log();
            }else{
               // if name not yet exited
               console.log(`Welcome ${data.userName}`);
               this.userSocketIDList.push(clientSocket.id);
               this.userNameList.push(data.userName);
               console.log(this.userNameList);
               console.log(this.userSocketIDList);
               console.log();
            }

            // enable next turn button for the first Client
            index = this.userSocketIDList.indexOf(clientSocket.id);
            console.log(index);
            if(index == 0){
               clientSocket.emit("enableNextTurnBtn", {});
            }

            // check if there's already 4 players
            if(this.userNameList.length == 4){
               this.io.sockets.emit("startGame", {message: "game started ♥10"});
               let main = new MainTest();
            }
         });   // end of register

         // listen when played a card
         clientSocket.on("nextTurn", (data: any) => {
            var index: number = this.userSocketIDList.indexOf(clientSocket.id);
            this.nextPlayer(index);
         });   // end of card played

         // listen when disconnected
         clientSocket.on("disconnect", () => {
            let index: number = this.userSocketIDList.indexOf(clientSocket.id);
            console.log(this.userSocketIDList[index+1] + " disconnected");
            this.userSocketIDList.splice(index, 2);
            console.log("\n");
         }) // end of disconnected
      });
   }  // end of listenSocketEvents
   // simulate turn based
   private simulateTurnBased(): void{
      // setInterval(() => {
      //    console.log("hello");
      //    this.io.sockets.emit("yourTurn", {message: "your turn"});
      // }, 2000);
   }

   // next player logic
   private nextPlayer(index: number): void{
      if(index < this.userSocketIDList.length-1){
         let nextPlayerID: string = this.userSocketIDList[index+1];
         this.io.to(nextPlayerID).emit("yourTurn", {});
      }else{
         let nextPlayerID: string = this.userSocketIDList[0];
         this.io.to(nextPlayerID).emit("yourTurn", {});
      }
   }  // end of nextPlayer

}

export default App;

























