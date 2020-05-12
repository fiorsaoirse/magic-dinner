export default class Recipe {
  constructor(title, text, portions, ingredients, calories,
    proteins, fat, carbs, image) {
    this.title = title;
    this.text = text;
    this.portions = portions;
    this.ingredients = ingredients;
    this.energy = {
      calories,
      proteins,
      fat,
      carbs,
    };
    this.image = image || '../../assets/DefaultRecipeImage.png';
  }
}
