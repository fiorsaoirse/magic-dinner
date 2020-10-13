import cheerio from 'cheerio';
import { findByPredicate, reduceNode } from './utils/nodesOperations';
import Recipe from './entities/classes/recipe';
import Ingredient from './entities/classes/ingredient';
import { formatText, isTagNode, isTextNode } from './utils/utils';
import getEnergyCalculating from './utils/parseEnergy';

const extractImage = (container) => {
    const previewRE = new RegExp('preview', 'gm');
    const imageNode = findByPredicate((currentNode) => {
        if (isTagNode(currentNode)) {
            const { name, parent: { attribs: { class: classList } } } = currentNode;
            const isPreviewNode = classList && previewRE.test(classList);
            return !isPreviewNode && (name === 'img' || name === 'image');
        }
        return false;
    }, container);
    return imageNode?.attribs?.src || imageNode?.attribs?.href || null;
};

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

const extractInstructions = (containers) => containers.map(({ children }) => {
    const mappedChildren = children.map((child) => reduceNode((innerAcc, innerNode) => {
        let newInnerAcc = [ ...innerAcc ];
        if (isTextNode(innerNode)) {
            const data = innerNode.data.trim();
            if (!!data && !data.match(/^(\d+\.)/)) {
                newInnerAcc = [ ...newInnerAcc, formatText(innerNode.data.trim()) ];
            }
        }
        return newInnerAcc;
    }, child, []));
    return mappedChildren.reduce((acc, child) => [ ...acc, ...child ]).join(' ');
});

const extractEnergy = (containers) => containers.reduce((acc, nutrition) => {
    const childTags = nutrition.children.filter((child) => isTagNode(child));
    // Define type of nutrition
    const typeNode = childTags.find((child) => child.attribs.class.includes('nutrition__name'));
    const type = typeNode.children.map((curr) => curr.data.trim()).join().toLowerCase();
    const valueNode = childTags.find((child) => child.attribs.class.includes('nutrition__weight'));
    const getValue = getEnergyCalculating(type);
    return getValue(acc, valueNode);
}, {});

const extractIngredients = (containers) => containers.reduce((acc, curr) => {
    const dataIngredient = curr.attribs['data-ingredient-object'];
    if (!dataIngredient && !dataIngredient.length) return acc;
    try {
        const parsedDataIngredient = JSON.parse(dataIngredient);
        const ingredient = new Ingredient(parsedDataIngredient.name.trim(),
            parsedDataIngredient.amount.trim());
        return [ ...acc, ingredient ];
    } catch (e) {
        console.error(`Error during parsing ingredients: ${e}`);
        throw new Error(e);
    }
}, []);

export default (html) => {
    const $ = cheerio.load(html);
    // Define containers
    const $recipeTitle = $('h1.recipe__name');
    const $recipeImageContainer = $('div.recipe__cover').get(0);
    const $info = $('div.recipe__info-pad');
    const $nutritionListContainer = $('ul.nutrition__list');
    const $nutritionList = ($nutritionListContainer.length !== 0 && $nutritionListContainer?.children()) || [];
    const $ingredientsList = $('div.ingredients-list.layout__content-col > div.ingredients-list__content >'
        + ' p.content-item');
    const $steps = $('span.instruction__description');
    // Get values from containers
    const image = extractImage($recipeImageContainer);
    const recipeTitle = $recipeTitle && $recipeTitle.text().trim();
    const portions = extractPortions(Array.from($info));
    const instructions = extractInstructions(Array.from($steps));
    const energy = extractEnergy(Array.from($nutritionList));
    const ingredients = extractIngredients(Array.from($ingredientsList));
    return new Recipe(formatText(recipeTitle), instructions, portions, ingredients, energy, image);
};
