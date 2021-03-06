import Recipe from '../../src/entities/classes/recipe';
import Ingredient from '../../src/entities/classes/ingredient';
import { expect } from '@jest/globals';

test('Crating instance of Recipe class', () => {
    const mockRecipe = {
        title: 'Картофельное пюре',
        text: ['Сварите картофель.',
            'Добавьте молоко и масло.',
            'Помните в пюре.'],
        portions: '4 порции',
        ingredients: [new Ingredient('Картофель', '4 штуки'), new Ingredient('Молоко', '100 мл'), new Ingredient('Масло', '20 грамм')],
        energy: {
            calories: 120,
            proteins: 12,
            fat: 2,
            carbs: 68,
        },
        image: '../../assets/DefaultRecipeImage.png',
    };
    const recipe = new Recipe(
        'Картофельное пюре',
        ['Сварите картофель.', 'Добавьте молоко и масло.', 'Помните в пюре.'],
        '4 порции',
        [new Ingredient('Картофель', '4 штуки'), new Ingredient('Молоко', '100 мл'), new Ingredient('Масло', '20 грамм')],
        {
            calories: 120,
            proteins: 12,
            fat: 2,
            carbs: 68,
        },
    );
    expect(recipe).toEqual(mockRecipe);
});
