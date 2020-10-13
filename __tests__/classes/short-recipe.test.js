import ShortRecipe from '../../src/entities/classes/short-recipe';
import { expect } from '@jest/globals';

test('Crating instance of ShortRecipe class', () => {
    const mockShortRecipe = {
        title: 'Салат Цезарь',
        image: 'image-link',
        url: 'url-link',
    };
    const shortRecipe = new ShortRecipe('Салат Цезарь', 'image-link', 'url-link');
    expect(shortRecipe).toEqual(mockShortRecipe);
});
