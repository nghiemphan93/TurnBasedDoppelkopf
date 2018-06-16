/**
 * Game controller manages the game
 * Can create players, all cards needed
 * and coordinates the rounds
 *
 * Attributes:
 *      numbRound:              the current round
 *      playersSetupFactory:    holding setup references to all players
 *      cardsSetupFactory:      holding setup references to all kinds of cards
 *      teamKreuzQueen:         list holding all team Kreuz Queen members
 *      teamNoKreuzQueen:       list holding all team No Kreuz Queen members
 *      whoHasTwoKreuzQueen:    holding 1 Player who has all 2 Kreuz Queen, if noone => null
 *      rounds:                 list holding which player won which round and what kind the first card was played (FEHL >< TRUMPF)
 *      pointTeamKreuzQueen:    holding points of Team Kreuz Queen
 *      pointTeamNoKreuzQueen:  holding points of Team No Kreuz Queen
 *      console:                write to or read from console
 *      crud:                   connection to database
 *      game_ID:                hold id of the current game in database
 *
 *
 * Important methods:
 *      initGame()              Setup players and cards
 *      startGame()             Start a game
 *      resetGame()             Prepare for new game
 *      endGame()               End a game
 *      startRound()            Start a round
 *      startRoundSeeding()     Start a auto seeding round, used for DEMO purpose
 *      whoWinsTheRound()       Determines who wins the round, given the CardsPlayedPerRound sorted
 *      sumUpPointTwoTeams      calculate points of each team
 *      checkHochzeit()         In case there's one player (A) has all 2 Kreuz Queen
 *                              Check if there's someone else (B) won any of the first 3 rounds with a FEHL round
 *                              return B as result
 *                              These two will play together as partners at Team Kreuz Queen
 *                              Otherwise, player A will play alone vs other 3
 *                              return NULL
 *
 *       checkBazinga()             Check and return true/ false if the round has Bazinga or not respectively
 *       checkPlayerGuessBazinga()  Check if guess of some player for Bazinga was correct
 *                                  Give 10 bonus points or take 5 points away if it's correct or not respectively
 *        whoGuessBazingaSeeding()  Simulate each round there's some one or no one who wants to guess for Bazinga
 *        saveAllCardsToDatabase()  Create all cards to store in database
 *        whichTeamWon()            Decides which team won
 *                                  If
 *                                  return >0 => Team Kreuz Queen won
 *                                  return <0 => Team No Kreuz Queen won
 *                                  return 0 =>  Draw, no team wins
 *
 *       setGameWonEachPlayer():    Set the property gameWon to true or false accordingly to every player
 *       setPartner():              Set partner for each player
 *
 */

export class GameController{

}