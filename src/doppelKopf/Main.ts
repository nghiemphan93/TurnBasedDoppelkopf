import {GameController} from "./Controller/GameController";
import socket from "socket.io";


// TEST TEST TEST
export class Main {
   constructor(io: socket.Server){
      let game: GameController = new GameController(io);
      game.preparePlayers();
   }
}
