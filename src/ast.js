import cheerio from 'cheerio';
import ShortRecipe from './entities/classes/short-recipe';
import { reduceNode } from './nodesOperations';
// eslint-disable-next-line import/named
import { formatText, isTagNode, isTextNode } from './utils/utils';

export default (html) => {
    const $ = cheerio.load(html);
    const recipeHref = new RegExp(/^\/recepty/);
    const allRecipes = Array.from($('div.tile-list__horizontal-tile > div.clearfix'));
    const result = allRecipes.map((node) => reduceNode((acc, curr) => {
        if (curr.type === 'tag' && curr.name === 'a' && recipeHref.test(curr.attribs.href)) {
            acc.url = curr.attribs.href;
        }
        if (curr.type === 'tag' && curr.name === 'div' && curr.attribs.class.includes('lazy-load-container')) {
            acc.image = curr.attribs['data-src'];
        }
        if (curr.type === 'tag' && curr.name === 'h3' && curr.attribs.class.includes('item-title')) {
            const anchorChild = curr.children.filter(isTagNode)[0];
            const spanChild = anchorChild.children.filter(isTagNode)[0];
            const textChild = spanChild.children.filter(isTextNode)[0];
            // Some spaces are shown as special symbols
            acc.title = formatText(textChild.data.trim());
        }
        return acc;
    }, node, {}));
    return result.map((curr) => new ShortRecipe(curr.title, curr.image, curr.url));
};
