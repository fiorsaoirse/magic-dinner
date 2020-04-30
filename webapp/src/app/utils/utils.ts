import { RecipesParams } from '../classes/recipes-params';
import { IIngredient } from '../interfaces/ingredient';

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

  public getRecipeParams(selected: IIngredient[], page: number | null): RecipesParams {
    const mappedToIds = selected.map(e => e.ObjectID);
    return new RecipesParams([],
                             mappedToIds,
                             [],
                             page);
  }
}
