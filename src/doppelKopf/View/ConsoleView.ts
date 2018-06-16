import {GameController} from "../Controller/GameController";
import {SortHelper} from "../Model/CardModel/SortHelper";
import {Card} from "../Model/CardModel/Card";
import {Player} from "../Model/PlayerModel/Player";

export class ConsoleView {
   //region Important methods
   /**
    * Display hands of every player
    * @param gameController
    */
   public displayAllHands(gameController: GameController): void {
      for (let player of gameController.playersSetupFactory.players) {
         console.log(player.toString() + "'s hand: " + player.cardsOnHand.toString());
      }
   }

   /**
    * Display cards played on table per round
    * @param gameController
    */
   public displayCardsPlayedPerRound(gameController: GameController): void {
      // Sort by strength
      SortHelper.sortByStrength(gameController.cardsSetupFactory.cardsPlayedPerRound);

      console.log("Cards played in round: ");
      let temp: string = "";
      for (let card of gameController.cardsSetupFactory.cardsPlayedPerRound.cards) {
         temp += `${card.toString()}: ${card.belongsToPlayer.toString()}, `;
      }
      console.log(temp);
   }

   /**
    * Display each players cards won
    * @param gameController
    */
   public displayEachPlayersCardsWon(gameController: GameController): void {
      for (let player of gameController.playersSetupFactory.players) {
         let temp: string = "";
         for (let card of player.cardsWon.cards) {
            temp += `${card.toString()} `;
         }

         console.log(player.toString() + " collected: " + temp);
      }
      console.log();
   }

   /**
    * Display each player Points
    * @param gameController
    */
   public displayEachPlayerPoints(gameController: GameController): void {
      for (let player of gameController.playersSetupFactory.players) {
         console.log(player.toString() + " achieved: " + player.calcPointsWonPerGame().toString() + " points");
      }
      console.log();
   }

   /**
    * Display final results which team wins and points
    * @param gameController
    */
   public displayTwoTeamResults(gameController: GameController): void {
      // getName 2 teams and points of each team
      // Team Kreuz Queen
      switch (gameController.teamKreuzQueen.length) {
         case 1:
            console.log("Team Kreuz Queen: " + gameController.teamKreuzQueen[0].toString() + " with " + gameController.pointTeamKreuzQueen.toString() + " points");
            break;
         case 2:
            console.log("Team Kreuz Queen: " + gameController.teamKreuzQueen[0].toString() + " and " + gameController.teamKreuzQueen[1].toString() + " with " + gameController.pointTeamKreuzQueen.toString() + " points");
            break;
      }

      // Team No Kreuz Queen
      switch (gameController.teamNoKreuzQueen.length) {
         case 1:
            console.log("Team No Kreuz Queen: " + gameController.teamNoKreuzQueen[0].toString() + " with " + gameController.pointTeamKreuzQueen.toString() + " points");
            break;
         case 2:
            console.log("Team No Kreuz Queen: " + gameController.teamNoKreuzQueen[0].toString() + " and " + gameController.teamNoKreuzQueen[1].toString() + " with " + gameController.pointTeamNoKreuzQueen.toString() + " points");
            break;
         case 3:
            console.log("Team No Kreuz Queen: " + gameController.teamNoKreuzQueen[0].toString() + ", " + gameController.teamNoKreuzQueen[1].toString() + " and " + gameController.teamNoKreuzQueen[2].toString() + " with " + gameController.pointTeamNoKreuzQueen.toString() + " points");
            break;
      }

      // which team wins
      console.log();
      if (gameController.whichTeamWon() > 0) {
         console.log("=====> Team Kreuz Queen wins with " + gameController.pointTeamKreuzQueen.toString() + " points");
      } else {
         if (gameController.whichTeamWon() < 0) {
            console.log("=====> Team No Kreuz Queen wins with " + gameController.pointTeamNoKreuzQueen.toString() + " points");
         } else {
            console.log("=====> Draw -- No team wins");
         }
      }

   }

   /**
    * Game Start Text
    */
   public gameStartText(): void {
      // game start
      console.log("==================================================================");
      console.log("GAME STARTED ");
      console.log("==================================================================");
   }

   /**
    * Game End Text
    */
   public gameEnded(): void {
      // game ended
      console.log("==================================================================");
      console.log("GAME ENDED ");
      console.log("==================================================================");
   }

   /**
    * Display who won which round
    * @param gameController
    */
   public displayWhoWonWhichRound(gameController: GameController): void {
      console.log("Players won the round next to: " + gameController.rounds.toString());
   }

   /**
    * Display what Card has been played
    * @param player
    * @param card
    */
   public displayWhatCardHasBeenPlayed(player: Player, card: Card): void {
      console.log(player.toString() + " played: " + card.toString());
      console.log(player.toString() + " still has: " + player.cardsOnHand.cards.length);
      console.log();
   }

   /**
    * Display who wins the round
    * @param roundWinner
    * @param cardsPerRound
    */
   public displayWhoWinsTheRound(roundWinner: Player, cardsPerRound: Array<Card>): void {
      console.log();
      console.log(roundWinner.toString() + " wins the round with " + cardsPerRound[0].toString());
   }

   /**
    * Display who guess Bazinga
    * @param whoGuessBazinga
    */
   public displayWhoGuessBazinga(whoGuessBazinga: Player): void {
      console.log();
      console.log(whoGuessBazinga.toString() + " guesses for Bazinga");
   }

   /**
    * Display guess Bazinga was correct
    * @param whoGuessBazinga
    */
   public displayGuessBazingaCorrect(whoGuessBazinga: Player): void {
      console.log("Guess for Bazinga was correct");
      console.log(whoGuessBazinga.toString() + " receives 10 bonus points");
      console.log();
   }

   /**
    * Display guess Bazinga was false
    * @param whoGuessBazinga
    */
   public displayGuessBazingaFalse(whoGuessBazinga: Player): void {
      console.log("Sorry, guess for Bazinga was not correct");
      console.log(whoGuessBazinga.toString() + " loses 5 points");
      console.log();
   }

   /**
    * Display Cards on Hand of the player
    * @param player
    */
   public displayCardsOnHandOfPlayer(player: Player): void {
      console.log(player.toString());
      console.log("Cards on hand: " + player.cardsOnHand.toString());
   }

   /**
    * Display cards allowed to play of the player
    * @param player
    */
   public displayCardsAllowedToPlayOfPlayer(player: Player): void {
      console.log("Cards allowed to play: " + player.cardsAllowedToPlay.toString());
   }

   /**
    * Display the new Partner in case Hochzeit
    * @param dreamPartner
    * @param gameController
    */
   public displayHochzeitNewPartner(dreamPartner: Player, gameController: GameController): void {
      if(gameController.whoHasTwoKreuzQueen != null){
         console.log("--------HOCHZEIT--------");
         console.log(dreamPartner + " plays with " + gameController.whoHasTwoKreuzQueen.toString());
      }

   }

   /**
    * Display play alone in case Hochzeit
    * @param gameController
    */
   public displayHochzeitAlone(gameController: GameController): void {
      if(gameController.whoHasTwoKreuzQueen != null){
         console.log("--------HOCHZEIT--------");
         console.log(gameController.whoHasTwoKreuzQueen.toString() + " plays alone");
      }

   }

   /**
    * Display the current round
    * @param gameController
    */
   public displayCurrentRound(gameController: GameController): void {
      console.log("==================================================================");
      console.log("ROUND " + gameController.numbRound);
      console.log("==================================================================");
   }

   /**
    * Display instruction to play another game or stop
    */
   public displayInstrucAnotherGameOrStop(): void {
      console.log();
      console.log("Please enter \"y\" or \"Y\" to play another game: ");
      console.log("Please enter \"n\" or \"N\" to stop: ");
   }

   /**
    * Instruction to enter command again
    */
   public displayEnterCommandAgain(): void {
      console.log("Please enter the command again: ");
   }

//endregion
}