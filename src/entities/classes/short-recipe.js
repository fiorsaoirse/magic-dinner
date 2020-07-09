export default class ShortRecipe {
    constructor(title, image = '../../assets/DefaultRecipeImage.png', url) {
        this.title = title;
        this.image = image;
        this.url = url;
    }
}
