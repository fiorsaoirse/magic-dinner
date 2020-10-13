import Ingredient from '../../src/entities/classes/ingredient';
import { expect } from '@jest/globals';

test('Crating instance of Ingredient class', () => {
    const mockIngredient = {
        name: 'Масло',
        amount: '300 грамм',
    };
    const ingredient = new Ingredient('Масло', '300 грамм');
    expect(ingredient).toEqual(mockIngredient);
});
