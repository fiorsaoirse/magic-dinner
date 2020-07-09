const defaultEnergy = {
    calories: 0,
    proteins: 0,
    fat: 0,
    carbs: 0,
};

export default class Recipe {
    constructor(title, text, portions, ingredients, energy, image = '../../assets/DefaultRecipeImage.png') {
        this.title = title;
        this.text = text;
        this.portions = portions;
        this.ingredients = ingredients;
        this.energy = energy || defaultEnergy;
        this.image = image;
    }
}
