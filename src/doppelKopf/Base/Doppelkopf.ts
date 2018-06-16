

export abstract class Doppelkopf{
   public abstract initGame(): void;
   public abstract startGame(): void;
   public abstract resetGame(): void;
   public abstract endGame(): void;

   public play(): void {
      this.initGame();
      this.startGame();
      this.resetGame();
      this.endGame();
   }
}