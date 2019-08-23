import { IShortRecipe } from '../interfaces/short-recipe';

export class ShortRecipe implements IShortRecipe {
  constructor(title, image, url) {
    this.title = title;
    this.image = image;
    this.url = url;
  }

  image: string;
  title: string;
  url: string;
}
