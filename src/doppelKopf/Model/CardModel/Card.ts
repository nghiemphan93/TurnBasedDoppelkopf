import {Suit} from "./Suit";
import {Rank} from "./Rank";
import {Player} from "../PlayerModel/Player";

export class Card {
   //region Attributes
   private _suit: Suit;         // PIK, KARO, HERZ, KREUZ
   private _rank: Rank;         // ZEHN, BUBE, DAME, KOENIG, ASS
   private _SimageURL: string;
   private _belongsToPlayer: Player;
   private _strength: string = "";
   private _point: number;
   private _isFehl: boolean;
   private _isTrumpf: boolean;
   //endregion

   //region Constructor
   constructor(suit: Suit, rank: Rank) {
      this._suit = suit;
      this._rank = rank;
   }

   //endregion

   //region Important methods
   /**
    * Set status FEHL | TRUMPF for each card
    */
   public setFehlAndTrumpf(): void {
      switch (this.suit + " " + this.rank) {
         case "KREUZ ASS":
         case "KREUZ KOENIG":
         case "KREUZ ZEHN":
         case "PIK ASS":
         case "PIK KOENIG":
         case "PIK ZEHN":
         case "HERZ ASS":
         case "HERZ KOENIG":
            this.setFehl(true);
            this.setTrumpf(false);
            break;
         default:
            this.setTrumpf(true);
            this.setFehl(false);
      }   // end of switch
   }

   /**
    * Determine the strength of each card compared to others
    */
   public setStrength(): void {
      if (this.isFehl) {
         // Set Strength for FEHL
         switch (this.suit) {
            case Suit.KREUZ:
               this.setStrengthHelperAssZehnKoenig("1");
               break;
            case Suit.PIK:
               this.setStrengthHelperAssZehnKoenig("2");
               break;
            case Suit.HERZ:
               this.setStrengthHelperAssZehnKoenig("3");
               break;
         }
      } else {
         // Set Strength for TRUMPF
         switch (this.rank) {
            case Rank.DAMEN:
               this.strength = "6";
               this.setStrengthHelperDameBuben();
               break;
            case Rank.BUBEN:
               this.strength = "5";
               this.setStrengthHelperDameBuben();
               break;
            default:
               if (this.suit == Suit.HERZ) {
                  // the Heart 10
                  this.strength = "7";
               } else {
                  // the Kreuz Ass, Zehn, Koenig
                  this.setStrengthHelperAssZehnKoenig("4");
               }

         }
      }
   }

   /**
    * Help method for setStrength
    */
   public setStrengthHelperDameBuben(): void {
      switch (this.suit) {
         case Suit.KARO:
            this.strength += "A";
            break;
         case Suit.HERZ:
            this.strength += "B";
            break;
         case Suit.PIK:
            this.strength += "C";
            break;
         case Suit.KREUZ:
            this.strength += "D";
            break;
      }
   }

   /**
    * Help method for setStrength
    */
   public setStrengthHelperAssZehnKoenig(firstLetter: string): void {
      this.strength = firstLetter;
      switch (this.rank) {
         case Rank.KOENIG:
            this.strength += "A";
            break;
         case Rank.ZEHN:
            this.strength += "B";
            break;
         case Rank.ASS:
            this.strength += "C";
            break;
      }
   }

   /**
    * Check and set Point according to Rank
    */

   public setPoint(): void {
      switch (this.rank) {
         case Rank.ZEHN:
            this.point = 10;
            break;
         case Rank.BUBEN:
            this.point = 2;
            break;
         case Rank.DAMEN:
            this.point = 3;
            break;
         case Rank.KOENIG:
            this.point = 4;
            break;
         case Rank.ASS:
            this.point = 11;
            break;
      }
   }

   /**
    * Return UNICODE Symbol for SUIT
    * @return
    */
   public suitToUnicode(): string {
      let result: string = "";
      switch (this.suit) {
         case Suit.PIK:
            result = "\u2660"; // ♠
            break;
         case Suit.KARO:
            result = "\u2666"; // ♦
            break;
         case Suit.HERZ:
            result = "\u2665";  // ♥
            break;
         case Suit.KREUZ:
            result = "\u2663"; // ♣
            break;
      }   // end of switch

      return result;
   }

   /**
    * Return UNICODE Symbol for RANK
    * @return
    */
   public rankToUnicode(): string {
      let result: string = "";
      switch (this.rank) {
         case Rank.ZEHN:
            result = "10";
            break;
         case Rank.BUBEN:
            result = "J";
            break;
         case Rank.DAMEN:
            result = "Q";
            break;
         case Rank.KOENIG:
            result = "K";
            break;
         case Rank.ASS:
            result = "A";
            break;
      }   // end of switch

      return result;
   }

   /**
    * Name of the card including Suit and Rank
    * @return
    */
   public getName(): string {
      return this.suit + " " + this.rank;
   }

   public toString(): string {
      return this.suitToUnicode() + this.rankToUnicode();
   }

   public setFehl(fehl: boolean): void {
      this.isFehl = fehl;
   }

   public setTrumpf(trumpf: boolean): void {
      this.isTrumpf = trumpf;
   }

   //endregion

   //region Getter Setter


   get suit(): Suit {
      return this._suit;
   }

   set suit(value: Suit) {
      this._suit = value;
   }

   get rank(): Rank {
      return this._rank;
   }

   set rank(value: Rank) {
      this._rank = value;
   }

   get SimageURL(): string {
      return this._SimageURL;
   }

   set SimageURL(value: string) {
      this._SimageURL = value;
   }

   get belongsToPlayer(): Player {
      return this._belongsToPlayer;
   }

   set belongsToPlayer(value: Player) {
      this._belongsToPlayer = value;
   }

   get strength(): string {
      return this._strength;
   }

   set strength(value: string) {
      this._strength = value;
   }

   get point(): number {
      return this._point;
   }

   set point(value: number) {
      this._point = value;
   }

   get isFehl(): boolean {
      return this._isFehl;
   }

   set isFehl(value: boolean) {
      this._isFehl = value;
   }

   get isTrumpf(): boolean {
      return this._isTrumpf;
   }

   set isTrumpf(value: boolean) {
      this._isTrumpf = value;
   }

   //endregion
}