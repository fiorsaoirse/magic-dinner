export class Utils {
  private static instance: Utils;
  private constructor() {}

  public static getUtils(): Utils {
    if (!this.instance) {
      this.instance = new Utils();
    }
    return this.instance;
  }

  public getRandomNumber (min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
