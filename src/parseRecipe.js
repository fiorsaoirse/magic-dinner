import cheerio from 'cheerio';
import {
    findNodeByPredicate, isTagNode, isTextNode, reduceNode,
} from './utils/nodesUtils';
import Recipe from './entities/classes/recipe';
import Ingredient from './entities/classes/ingredient';
import getEnergyCalculating from './utils/parseEnergy';
import formatChars from './utils/charsFormatter';

// todo: fix
const extractImage = (container) => {
    const imageNode = findNodeByPredicate((currentNode) => {
        if (!isTagNode(currentNode)) {
            return false;
        }
        const { name, parent: { attribs: { class: classList } } } = currentNode;
        const isPreviewNode = classList && /preview/gm.test(classList);
        return !isPreviewNode && (name === 'img' || name === 'image');
    }, container);
    return imageNode?.attribs?.src || imageNode?.attribs?.href || null;
};

// todo: fix
const extractPortions = (containers) => containers.reduce((acc, node) => {
    const result = reduceNode((nAcc, currentNode) => {
        if (isTextNode(currentNode) && currentNode.parent.name === 'span'
            && currentNode.parent.attribs.class.includes('js-portions-count-print')) {
            return currentNode.data.trim();
        }
        return nAcc;
    }, node, []);
    return [ ...acc, result ];
}, []).join('');

// todo: fix
const extractInstructions = (containers) => containers.map(({ children }) => {
    const mappedChildren = children.map((child) => reduceNode((innerAcc, innerNode) => {
        let newInnerAcc = [ ...innerAcc ];
        if (isTextNode(innerNode)) {
            const data = innerNode.data.trim();
            if (!!data && !data.match(/^(\d+\.)/)) {
                newInnerAcc = [ ...newInnerAcc, formatChars(innerNode.data.trim()) ];
            }
        }
        return newInnerAcc;
    }, child, []));
    return mappedChildren.reduce((acc, child) => [ ...acc, ...child ]).join(' ');
});

// todo: fix
const extractEnergy = (containers) => containers.reduce((acc, nutrition) => {
    const childTags = nutrition.children.filter((child) => isTagNode(child));
    const typeNode = childTags.find((child) => child.attribs.class.includes('nutrition__name'));
    const type = typeNode.children.map((curr) => curr.data.trim()).join().toLowerCase();
    const valueNode = childTags.find((child) => child.attribs.class.includes('nutrition__weight'));
    const getValue = getEnergyCalculating(type);
    return getValue(acc, valueNode);
}, {});

// todo: fix
const extractIngredients = (containers) => containers.reduce((acc, curr) => {
    const dataIngredient = curr.attribs['data-ingredient-object'];
    if (!dataIngredient?.length) return acc;
    const parsedIngredient = JSON.parse(dataIngredient);
    const ingredient = new Ingredient(parsedIngredient.name.trim(),
        parsedIngredient.amount.trim());
    return [ ...acc, ingredient ];
}, []);

export default (html) => {
    const dom = cheerio.load(html);
    const titleContainer = dom('h1.recipe__name');
    const imageContainer = dom('div.recipe__cover').get(0);
    const infoContainer = dom('div.recipe__info-pad');
    // todo: fix?
    const nutritionListContainer = dom('ul.nutrition__list');
    const nutritionList = (nutritionListContainer.length !== 0 && nutritionListContainer?.children()) || [];
    const ingredientsList = dom('div.ingredients-list.layout__content-col > div.ingredients-list__content >'
        + ' p.content-item');
    const stepsContainer = dom('span.instruction__description');
    const image = extractImage(imageContainer);
    const recipeTitle = titleContainer && titleContainer.text().trim();
    const portions = extractPortions(Array.from(infoContainer));
    const instructions = extractInstructions(Array.from(stepsContainer));
    const energy = extractEnergy(Array.from(nutritionList));
    const ingredients = extractIngredients(Array.from(ingredientsList));
    return new Recipe(formatChars(recipeTitle), instructions, portions, ingredients, energy, image);
};
