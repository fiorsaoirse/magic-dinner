const defaultEnergy = {
    calories: 0,
    proteins: 0,
    fat: 0,
    carbs: 0,
};

export default class Recipe {
    constructor(title, text, portions, ingredients, energy, image) {
        this.title = title;
        this.text = text;
        this.portions = portions;
        this.ingredients = ingredients;
        this.energy = Object.keys(energy).length ? energy : defaultEnergy;
        this.image = image || '../../assets/DefaultRecipeImage.png';
    }
}
