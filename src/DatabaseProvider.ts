import "reflect-metadata";
import {Connection, createConnection, EntityManager, getManager, getRepository} from "typeorm";
import {error} from "util";

export class DatabaseProvider {
   public static connection: Connection;

   public static async setupConnection(): Promise<Connection>{
      if(DatabaseProvider.connection){
         return DatabaseProvider.connection;
      }else{
         DatabaseProvider.connection = await createConnection();
         return DatabaseProvider.connection;
      }


   }

}
