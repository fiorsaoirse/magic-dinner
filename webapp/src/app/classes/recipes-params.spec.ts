import { RecipesParams } from './recipes-params';

describe('RecipesParams', () => {
  it('should create an instance', () => {
    expect(new RecipesParams('abs', [], [], [])).toBeTruthy();
  });
});
