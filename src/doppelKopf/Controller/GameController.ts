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
 *      startGameSeeding()             Start a game
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
import {PlayersSetupFactory} from "./PlayersSetupFactory";
import {CardsSetupFactory} from "./CardsSetupFactory";
import {Player} from "../Model/PlayerModel/Player";
import {CRUD} from "./CRUD";
import {Doppelkopf} from "../Base/Doppelkopf";
import {Suit} from "../Model/CardModel/Suit";
import {Card} from "../Model/CardModel/Card";
import {CardsPlayedPerRound} from "../Model/CardModel/CardsPlayedPerRound";
import {ConsoleView} from "../View/ConsoleView";
import {SocketSetup} from "../SocketSetup";
import socket from "socket.io";

export class GameController extends Doppelkopf{
   //region Attributes
   private _numbRound: number;
   private _playersSetupFactory: PlayersSetupFactory;
   private _cardsSetupFactory: CardsSetupFactory;
   private _teamKreuzQueen: Array<Player>;
   private _teamNoKreuzQueen: Array<Player>;
   private _whoHasTwoKreuzQueen: Player | null;
   private _rounds: Array<Player | Card>;
   private _pointTeamKreuzQueen: number;
   private _pointTeamNoKreuzQueen: number;
   private _playersGuessBazinga: Array<Player | null>;
   private _crud: CRUD;
   private _game_ID: number = 0;
   private _console: ConsoleView;
   private _io: socket.Server;
   private _socketSetup: SocketSetup;
   private _roundEnded: boolean = false;
   //endregion

   //region Constructor
   constructor(io: socket.Server){
      super();
      this.io = io;
   }
   //endregion

   //region Important methods
   /**
    * Setup players and cards
    */
   public initGame(): void{
      this.cardsSetupFactory = new CardsSetupFactory(this.playersSetupFactory);
      this.numbRound = 0;
      this.teamKreuzQueen = [];
      this.teamNoKreuzQueen = [];
      this.rounds = [];
      this.pointTeamKreuzQueen = 0;
      this.pointTeamNoKreuzQueen = 0;
      this.playersGuessBazinga = [];
      this.console = new ConsoleView();
      this.crud = new CRUD();
      this.game_ID = 0;
      this.cardsSetupFactory.initCardSetup();

      for(let player of this.playersSetupFactory.players){
         console.log(player.cardsOnHand.toString());
      }


      //  prepare which players are allowed to guess for Bazinga
      this.playersGuessBazinga.push(...this.playersSetupFactory.players);
      // the last position represents no player wants to guess for Bazinga that round
      this.playersGuessBazinga.push(null);

      // set who has Kreuz Queen, who not
      this.cardsSetupFactory.checkPlayerHasKreuzQueen();

      // separate two teams
      this.whoHasTwoKreuzQueen = this.calWhoHasTwoKreuzQueen();

      // Start the game
      setInterval(() => {
         this.startGame();
      }, 1000/60);
   }

   /**
    * Prepare players
    */
   public preparePlayers(): void{
      this.socketSetup = new SocketSetup(this.io, this);
      this.playersSetupFactory = new PlayersSetupFactory(this.socketSetup, this);
      this.playersSetupFactory.init();
   }


   /**
    * Start a game
    */
   public startGame(): void{

   }


   /**
    * Start a game
    */
   public startGameSeeding(): void{
      // check to play another game or stop
      let anotherGame: boolean = true;

      // simulate the game
      while(anotherGame){
         // game start
         this.console.gameStartText();

         // create all cards needed then deal to players
         this.cardsSetupFactory.initCardSetup();

         // increase game_ID
         // this.game_ID = this.crud.insertNewGame(this.playersSetupFactory.getPlayers());

         // console.log(this.game_ID);

         //  prepare which players are allowed to guess for Bazinga
         this.playersGuessBazinga.push(...this.playersSetupFactory.players);
         // the last position represents no player wants to guess for Bazinga that round
         this.playersGuessBazinga.push(null);

         // set who has Kreuz Queen, who not
         this.cardsSetupFactory.checkPlayerHasKreuzQueen();

         // separate two teams
         // set the one who has all 2 Kreuz Queen in case there's actually someone
         this.whoHasTwoKreuzQueen = this.calWhoHasTwoKreuzQueen();

         // play 10 rounds
         for(let i = 0; i<10; i++){
            // set the current round
            this.numbRound = i+1;

            // until round 4, check Hochzeit for the first three rounds
            if(this.numbRound == 4 && this.whoHasTwoKreuzQueen != null){
               let dreamPartner: Player | null = this.checkHochzeit();
               if(dreamPartner != null){
                  // getName to screen new partner
                  this.console.displayHochzeitNewPartner(dreamPartner, this);
               }else{
                  // getName to screen who plays alone
                  this.console.displayHochzeitAlone(this);
               }
            }

            // show the current round title
            this.console.displayCurrentRound(this);

            // simulate a round
            this.startRoundSeeding();
         }

         // game ended
         this.console.gameEnded();

         // debug
         this.console.displayWhoWonWhichRound(this);

         // getName all cards every player has collected
         this.console.displayEachPlayersCardsWon(this);

         // all points of each players
         this.console.displayEachPlayerPoints(this);

         // all points of each team including members
         this.sumUpPointTwoTeams();

         // which team wins
         this.console.displayTwoTeamResults(this);

         // set game won for each player
         this.setGameWonEachPlayer();


         //*========================*//
         // insert stuff to database
         //*========================*/

         // insert all cards won for each player
         // for(let player of this.playersSetupFactory.players){
         //    this.crud.insertCardsCollected(player, player.getCardsWon().getCards());
         // }

         // insert the game was played to history of each player
         // first setPartner
         this.setPartner();
         // for(let player of this.playersSetupFactory.players){
         //    this.crud.insertGamePlayed(player, player.getPartner(), this.game_ID);
         // }


         // type "y" to play another game
         // "n" to stop
         // console.displayInstrucAnotherGameOrStop();
         //
         // while(true){
         //    String command = this.console.getSc().next();
         //    if(command.toUpperCase().compareTo("Y") == 0){
         //       anotherGame = true;
         //       resetGame();
         //       break;
         //    }else{
         //       if(command.toUpperCase().compareTo("N") == 0){
         //          anotherGame = false;
         //          break;
         //       }else{
         //          console.displayEnterCommandAgain();
         //       }
         //    }
         // } // end of while (command)

         anotherGame = false;
      }   // end of while(anotherGame)
   }

   /**
    * End a game
    */
   public endGame(): void{

   }

   /**
    * Prepare for new game
    */
   public resetGame(): void{
      this.initGame();
   }



   /**
    * Start a round
    */
   public startRound(): void{

   }

   public endRound(): void{

   }

   /**
    * Start an auto seeding round, used for DEMO purpose
    */
   public startRoundSeeding(): void{
      // each player takes turn to play
      for(let i = 0; i<4; i++){
         let player: Player = this.playersSetupFactory.players[i];

         // if 1. Player => CardsAllowedToPlay = CardsOnHand
         if(i == 0){
            player.cardsAllowedToPlay.clear();
            player.cardsAllowedToPlay.addAll(player.cardsOnHand.cards);
         }else{
            player.setWhatCardToPlay(this.cardsSetupFactory.cardsPlayedPerRound.cards[0]);
         }

         // getName the CardsOnHand of the player
         this.console.displayCardsOnHandOfPlayer(player);

         // getName the CardsAllowedToPlay of the player
         this.console.displayCardsAllowedToPlayOfPlayer(player);

         // show what card has been played
         let card = player.playARandomCard();
         this.console.displayWhatCardHasBeenPlayed(player, card);

         // save the just played card to CardsPlayed in Database
         // this.crud.insertCardPlayed(player, card);

         // add the card to CardsPlayedPerRound
         this.cardsSetupFactory.cardsPlayedPerRound.add(card);
      }   // end of for

      // getName all player's hand + Cards played per round
      this.console.displayAllHands(this);
      this.console.displayCardsPlayedPerRound(this);

      // getName who wins the round
      let roundWinner: Player = this.whoWinsTheRound(this.cardsSetupFactory.cardsPlayedPerRound);
      let cardsPerRound: Array<Card> = this.cardsSetupFactory.cardsPlayedPerRound.cards;
      this.console.displayWhoWinsTheRound(roundWinner, cardsPerRound);

      // add the winner to the list rounds
      this.rounds.push(roundWinner);
      // add the first card played in round next to the winner
      // to determine if the player won a FEHL Stich or Trumpf Stich
      this.rounds.push(this.cardsSetupFactory.cardsPlayedPerRound.cards[0]);

      // add the won cards to the player's CardsWon
      roundWinner.cardsWon.addAll(cardsPerRound);

      // rearrange the order of players for next round
      // winner of the last round begins the next round
      for(let i = 0; i < this.playersSetupFactory.players.length; i++){
         let player: Player = this.playersSetupFactory.players[0];

         if(player.toString().localeCompare(roundWinner.toString()) == 0){
            // if the first position is the round winner, stop
            break;
         }else{
            // add the first player to the end of the players list
            this.playersSetupFactory.players.push(player);

            // remove the first player from the player list
            this.playersSetupFactory.players.splice(0,1);
         }
      }

      // debug simulate Bazinga guess
      let whoGuessBazinga: Player | null = this.whoGuessBazingaSeeding();
      if(whoGuessBazinga != null){
         this.console.displayWhoGuessBazinga(whoGuessBazinga);
      }

      // check if guess for Bazinga was correct
      if(whoGuessBazinga != null){
         if(this.checkPlayerGuessBazinga(whoGuessBazinga, this.checkBazinga())){
            this.console.displayGuessBazingaCorrect(whoGuessBazinga);
         }else{
            this.console.displayGuessBazingaFalse(whoGuessBazinga);
         }
      }

      // clear the CardsPlayedPerRound
      this.cardsSetupFactory.cardsPlayedPerRound.clear();
   }  // end of startRoundSeeding


   /**
    * Determines who wins the round, given the CardsPlayedPerRound sorted
    * @param cardsPlayedPerRound
    * @return
    */
   public whoWinsTheRound(cardsPlayedPerRound: CardsPlayedPerRound): Player{

   return cardsPlayedPerRound.cards[0].belongsToPlayer;
}   // end of whoWinsTheRound

   /**
    * Determine who has Kreuz Queen and who not
    * Return the player who has all 2 Kreuz Queen
    * if no one, return NULL
    * @return
    */
   public calWhoHasTwoKreuzQueen(): Player | null{
      // walk through every player
      for(let player of this.playersSetupFactory.players){
         if(player.hasKreuzQueen){
            // if the player has KREUZ QUEEN
            this.teamKreuzQueen.push(player);
         }else{
            // if no KREUZ QUEEN
            this.teamNoKreuzQueen.push(player);
         }
      }   // end of for

      if(this.teamKreuzQueen.length == 1){
         // if there's someone who has all 2 Kreuz Queen, return him
         return this.teamKreuzQueen[0];
      }else{
         // if not, return NULL
         return null;
      }
   }   // end of whoHasTwoKreuzQueen

   /**
    * Calculate points of each team then getName them accordingly
    */
   public sumUpPointTwoTeams(): void{
      // calculate points of each team
      // Team Kreuz Queen
      this.pointTeamKreuzQueen = 0;
      for(let i = 0; i< this.teamKreuzQueen.length; i++){
         this.pointTeamKreuzQueen += this.teamKreuzQueen[i].pointsWonPerGame;
         // console.log(this.teamKreuzQueen[i] + " " + this.teamKreuzQueen[i].pointsWonPerGame);
      }

      // Team No Kreuz Queen
      this.pointTeamNoKreuzQueen = 0;
      for(let i = 0; i< this.teamNoKreuzQueen.length; i++){
         this.pointTeamNoKreuzQueen += this.teamNoKreuzQueen[i].pointsWonPerGame;
         // console.log(this.teamNoKreuzQueen[i] + " " + this.teamNoKreuzQueen[i].pointsWonPerGame);
      }
   }   // end of sumUpPointTwoTeams

   /**
    * In case there's one player (A) has all 2 Kreuz Queen
    * Check if there's someone else (B) won any of the first 3 rounds with a FEHL round
    * return B as result
    * These two will play together as partners at Team Kreuz Queen
    *
    * Otherwise, player A will play alone vs other 3
    * return NULL
    * @return
    */
   public checkHochzeit(): Player | null{
      for(let i = 0; i < 5; i+= 2){
         // get each player
         // check if it's not the player who's got all 2 Kreuz Queen
         let dreamPartner: Player = <Player>this.rounds[i];
         if(this.whoHasTwoKreuzQueen != null){
            if(dreamPartner.toString().localeCompare(this.whoHasTwoKreuzQueen.toString()) != 0){
               // check if the round won by him was FEHL
               let roundWonByDreamPartner: Card = <Card>this.rounds[i+1];
               if (roundWonByDreamPartner.isFehl){
                  // add dreamPartner to Team Kreuz Queen
                  this.teamKreuzQueen.push(dreamPartner);

                  // remove him from Team No Kreuz Queen
                  let index: number = this.teamKreuzQueen.indexOf(dreamPartner);
                  this.teamNoKreuzQueen.splice(index, 1);

                  return dreamPartner;
               }
            }
         }

      }   // end of for
      return null;
   }   // end of checkHochzeit

   /**
    * Check and return true/ false if the round has Bazinga or not respectively
    * @return
    */
   public checkBazinga(): boolean {
      // initialize an array holding how many times each Suit appears in the round
      let suitNumb: Array<number> = [0,0,0,0];
      // suitNumb.push(0);
      // suitNumb.push(0);
      // suitNumb.push(0);
      // suitNumb.push(0);

      // count the times each Suit appears
      for (let card of this.cardsSetupFactory.cardsPlayedPerRound.cards) {
         switch (card.suit) {
            case Suit.HERZ:
               suitNumb[0]++;
               break;
            case Suit.KARO:
               suitNumb[1]++;
               break;
            case Suit.PIK:
               suitNumb[2]++;
               break;
            case Suit.KREUZ:
               suitNumb[3]++;
               break;
         }   // end of switch
      }   // enf of for

      // count how many times the number "2" appears in the suitNumb array
      // if the number "2" appears exactly twice => Bazinga
      let frequencyOfTwo: number = 0;
      for(let i = 0; i < suitNumb.length; i++){
         if(suitNumb[i] === 2){
            frequencyOfTwo++;
         }
      }   // end of for

      // return result
      if(frequencyOfTwo === 2){
         return true;
      }else{
         return false;
      }
   }   // end of checkBazinga

   /**
    * Check if guess of some player for Bazinga was correct
    * Give 10 bonus points or take 5 points away if it's correct or not respectively
    * @param whoGuessBazinga
    * @param checkBazinga
    * @return
    */
   public checkPlayerGuessBazinga(whoGuessBazinga: Player, checkBazinga: boolean): boolean{
      if(checkBazinga){
         whoGuessBazinga.specialPoints = 10;
         return true;
      }else{
         whoGuessBazinga.specialPoints = -5;
         return false;
      }
   }   // end of checkPlayerGuessBazinga

   /**
    * Simulate each round there's some one or no one who wants to guess for Bazinga
    *
    * @return
    */
   public whoGuessBazingaSeeding(): Player | null{
      // randomly pick the position of player who tries to guess for Bazinga of the current round
      // the positions are in the list playersGuessBazinga
      // last position means no player wanna guess for Bazinga this round
      // after each guess, the player who guessed will be removed => no longer can guess next time
      let indexPlayersGuessBazinga: number = Math.floor(Math.random() *  this.playersGuessBazinga.length);

      let playerToReturn: Player | null = this.playersGuessBazinga[indexPlayersGuessBazinga];
      if(playerToReturn !== null){
         playerToReturn.guessBazinga();
         this.playersGuessBazinga.splice(indexPlayersGuessBazinga, 1);
      }

      return playerToReturn;
   }   // end of whoGuessBazingaSeeding

   /**
    * Decides which team won
    * If
    *  return >0 => Team Kreuz Queen won
    *  return <0 => Team No Kreuz Queen won
    *  return 0 =>  Draw, no team wins
    * @return
    */
   public whichTeamWon(): number{
      return this.pointTeamKreuzQueen - this.pointTeamNoKreuzQueen;
   }

   /**
    * Set the property gameWon to true or false accordingly to every player
    */
   public setGameWonEachPlayer(): void{
      if(this.whichTeamWon() > 0){
         for (let player of this.teamKreuzQueen){
            let index: number = this.playersSetupFactory.players.indexOf(player);
            this.playersSetupFactory.players[index].gameWon = true;
         }
      }else{
         if(this.whichTeamWon() < 0){
            for (let player of this.teamNoKreuzQueen){
               let index: number = this.playersSetupFactory.players.indexOf(player);
               this.playersSetupFactory.players[index].gameWon = true;
            }
         }
      }
   }   // end of setGameWonEachPlayer


   /**
    * Set partner for each player
    */
   public setPartner(): void{
      // assume that there's always 2 vs 2 teams
      if(this.teamNoKreuzQueen.length == this.teamKreuzQueen.length){
         // for team Kreuz Queen
         this.teamKreuzQueen[0].partner = this.teamKreuzQueen[1];
         this.teamKreuzQueen[1].partner = this.teamKreuzQueen[0];

         // for team No Kreuz Queen
         this.teamNoKreuzQueen[0].partner = this.teamNoKreuzQueen[1];
         this.teamNoKreuzQueen[1].partner = this.teamNoKreuzQueen[0];
      }
   }   // end of setPartner


   //region Getter Setter
   get numbRound(): number {
      return this._numbRound;
   }

   set numbRound(value: number) {
      this._numbRound = value;
   }

   get playersSetupFactory(): PlayersSetupFactory {
      return this._playersSetupFactory;
   }

   set playersSetupFactory(value: PlayersSetupFactory) {
      this._playersSetupFactory = value;
   }

   get cardsSetupFactory(): CardsSetupFactory {
      return this._cardsSetupFactory;
   }

   set cardsSetupFactory(value: CardsSetupFactory) {
      this._cardsSetupFactory = value;
   }

   get teamKreuzQueen(): Array<Player> {
      return this._teamKreuzQueen;
   }

   set teamKreuzQueen(value: Array<Player>) {
      this._teamKreuzQueen = value;
   }

   get teamNoKreuzQueen(): Array<Player> {
      return this._teamNoKreuzQueen;
   }

   set teamNoKreuzQueen(value: Array<Player>) {
      this._teamNoKreuzQueen = value;
   }

   get whoHasTwoKreuzQueen(): Player | null {
      return this._whoHasTwoKreuzQueen;
   }

   set whoHasTwoKreuzQueen(value: Player | null) {
      this._whoHasTwoKreuzQueen = value;
   }

   get rounds(): Array<Player | Card> {
      return this._rounds;
   }

   set rounds(value: Array<Player | Card>) {
      this._rounds = value;
   }

   get pointTeamKreuzQueen(): number {
      return this._pointTeamKreuzQueen;
   }

   set pointTeamKreuzQueen(value: number) {
      this._pointTeamKreuzQueen = value;
   }

   get pointTeamNoKreuzQueen(): number {
      return this._pointTeamNoKreuzQueen;
   }

   set pointTeamNoKreuzQueen(value: number) {
      this._pointTeamNoKreuzQueen = value;
   }

   get playersGuessBazinga(): Array<Player | null> {
      return this._playersGuessBazinga;
   }

   set playersGuessBazinga(value: Array<Player | null>) {
      this._playersGuessBazinga = value;
   }

   get crud(): CRUD {
      return this._crud;
   }

   set crud(value: CRUD) {
      this._crud = value;
   }

   get game_ID(): number {
      return this._game_ID;
   }

   set game_ID(value: number) {
      this._game_ID = value;
   }

   get console(): ConsoleView {
      return this._console;
   }

   set console(value: ConsoleView) {
      this._console = value;
   }


   get io(): SocketIO.Server {
      return this._io;
   }

   set io(value: SocketIO.Server) {
      this._io = value;
   }

   get socketSetup(): SocketSetup {
      return this._socketSetup;
   }

   set socketSetup(value: SocketSetup) {
      this._socketSetup = value;
   }


   get roundEnded(): boolean {
      return this._roundEnded;
   }

   set roundEnded(value: boolean) {
      this._roundEnded = value;
   }

//endregion
}