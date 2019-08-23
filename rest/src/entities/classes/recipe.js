export default class Recipe {
  constructor(title, image, text, url, calories, proteins, fat, carbs) {
    this.title = title;
    this.image = image;
    this.text = text;
    this.url = url;
    this.energy = {
      calories,
      proteins,
      fat,
      carbs,
    };
  }
}
