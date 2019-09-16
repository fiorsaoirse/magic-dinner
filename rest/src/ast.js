import cheerio from 'cheerio';
import ShortRecipe from './entities/classes/short-recipe';
import { reduceNode } from './nodesOperations';

export default (html) => {
  const $ = cheerio.load(html);
  const recipeHref = new RegExp(/^\/recepty/);
  const allRecipes = Array.from($('div.tile-list__horizontal-tile > div.clearfix'));
  const result = allRecipes.map((node) => reduceNode((acc, curr) => {
    if (curr.type === 'tag' && curr.name === 'a' && recipeHref.test(curr.attribs.href)) {
      acc.url = curr.attribs.href;
    }
    if (curr.type === 'tag' && curr.name === 'div' && curr.attribs.class.includes('lazy-load-container')) {
      acc.title = curr.attribs['data-title'];
      acc.image = curr.attribs['data-src'];
    }
    return acc;
  }, node, {}));
  return result.map((curr) => new ShortRecipe(curr.title, curr.image, curr.url));
};
