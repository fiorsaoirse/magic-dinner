import cheerio from 'cheerio';
import ShortRecipe from './entities/classes/short-recipe';
import { isTagNode, isTextNode, reduceNode } from './utils/nodesUtils';
import formatChars from './utils/charsFormatter';

const nodeTypes = [
    {
        check: (node) => isTagNode(node) && /^\/recepty/.test(node.attribs.href),
        process: (obj, { attribs }) => ({ ...obj, url: attribs.href }),
    },
    {
        check: (node) => isTagNode(node) && node.attribs?.class?.includes('lazy-load-container'),
        process: (obj, { attribs }) => ({ ...obj, image: attribs['data-src'] }),
    },
    {
        check: (node) => isTagNode(node) && node.name === 'h3' && node.attribs?.class?.includes('item-title'),
        process: (obj, node) => {
            const [ anchorChild ] = node.children.filter(isTagNode);
            const [ spanChild ] = anchorChild.children.filter(isTagNode);
            const [ textChild ] = spanChild.children.filter(isTextNode);
            const title = formatChars(textChild.data.trim());
            return ({ ...obj, title });
        },
    },
];

const getProcess = (node) => nodeTypes.find(({ check }) => check(node));

export default (html) => {
    const dom = cheerio.load(html);
    const recipeNodes = Array.from(dom('div.tile-list__horizontal-tile > div.clearfix'));
    const processNode = (acc, node) => {
        const nodeType = getProcess(node);
        if (!nodeType) {
            return acc;
        }
        const { process } = nodeType;
        return process(acc, node);
    };
    const recipesData = recipeNodes.map((recipeNode) => reduceNode(processNode, recipeNode, {}));
    return recipesData.map(({ title, image, url }) => new ShortRecipe(title, image, url));
};
