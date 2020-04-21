import { IShortRecipe } from '../interfaces/short-recipe';

export class ShortRecipe implements IShortRecipe {
  constructor(title: string, image: string, url: string) {
    this.title = title;
    this.image = image;
    this.url = url;
  }

  image: string;
  title: string;
  url: string;
}
