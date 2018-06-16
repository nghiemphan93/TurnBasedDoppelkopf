/**
 * Connection to mySql
 *
 * Attributes:
 *      connection:
 *      preparedStatement:
 *      resultSet:
 *      dbUrl:      "jdbc:mysql://localhost:3306/doppelkopf?useSSL=false"
 *      user:       "student"
 *      pass:       "student"
 *
 * Important methods:
 *      insertAllCardsToDatabase(): Insert all new cards to database
 *      insertCardPlayed():         Insert card played in a round to database
 *      insertCardsCollected():     Insert cards collected in one game to database
 *      selectCardID():             Return card_ID from database given the card object
 *      selectPlayerID():           Return player_ID from database given the player object
 *      insertNewGame():            Insert new game to database, return the game_ID
 *      insertGamePlayed():         Insert a all information of the game played by one player to database
 *                                  including: hadKreuzQueen, pointsWonInGame, wonOrNot, player_ID, partnerInGame_ID, game_ID
 */

export class CRUD{

}