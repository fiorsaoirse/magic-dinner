import cheerio from 'cheerio';
import ShortRecipe from './entities/classes/short-recipe';
import { reduceNode } from './nodesOperations';

const filterTagChildren = (item) => item.type === 'tag';

const filterTextChildren = (item) => item.type === 'text';

const replaceNbsps = (string) => {
    const re = new RegExp(String.fromCharCode(160), 'g');
    return string.replace(re, ' ');
};

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
            const anchorChild = curr.children.filter(filterTagChildren)[0];
            const spanChild = anchorChild.children.filter(filterTagChildren)[0];
            const textChild = spanChild.children.filter(filterTextChildren)[0];
            // Some spaces are shown as special symbols
            acc.title = replaceNbsps(textChild.data.trim());
        }
        return acc;
    }, node, {}));
    return result.map((curr) => new ShortRecipe(curr.title, curr.image, curr.url));
};
