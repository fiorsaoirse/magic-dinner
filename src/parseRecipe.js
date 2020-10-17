import cheerio from 'cheerio';
import {
    findNodeByPredicate, isTagNode,
    isTextNode, reduceNode,
} from './utils/nodesUtils';
import Recipe from './entities/classes/recipe';
import Ingredient from './entities/classes/ingredient';
import getEnergyCalculating from './utils/parseEnergy';
import formatChars from './utils/charsFormatter';

const extractImage = (container) => {
    const imageContainerPredicate = ((node) => {
        if (!isTagNode(node)) {
            return false;
        }
        const { name, parent: { attribs: { class: classList } } } = node;
        const isPreviewNode = classList && /preview/gm.test(classList);
        return !isPreviewNode && (name === 'img' || name === 'image');
    });
    const imageNode = findNodeByPredicate(imageContainerPredicate, container);
    return imageNode?.attribs?.src || imageNode?.attribs?.href || null;
};

const extractPortions = (containers) => containers.reduce((acc, node) => {
    const getPortion = (iAcc, iNode) => {
        const parentNode = iNode.parent;
        const isNecessaryNode = isTextNode(iNode) && parentNode?.name === 'span'
            && parentNode?.attribs.class.includes('js-portions-count-print');
        return isNecessaryNode ? iNode.data.trim() : iAcc;
    };
    const portionData = reduceNode(getPortion, node, []);
    return [ ...acc, portionData ];
}, []).join('');

const extractInstructions = (containers) => containers.map(({ children }) => {
    const getInstruction = (acc, node) => {
        if (!isTextNode(node)) {
            return acc;
        }
        const data = node?.data.trim();
        const digitOfStepPattern = /^(\d+\.)/;
        const isDataDigitOfStep = data && !data.match(digitOfStepPattern);
        return isDataDigitOfStep ? [ ...acc, formatChars(data)] : acc;
    };
    const mappedChildren = children.map((child) => reduceNode(getInstruction, child, []));
    return mappedChildren.reduce((acc, child) => [ ...acc, ...child ]).join(' ');
});

const extractEnergy = (containers) => containers.reduce((acc, nutrition) => {
    const childTags = nutrition.children.filter((child) => isTagNode(child));
    const typeNode = childTags.find((child) => child.attribs.class.includes('nutrition__name'));
    const type = typeNode.children.map((curr) => curr.data.trim()).join().toLowerCase();
    const valueNode = childTags.find((child) => child.attribs.class.includes('nutrition__weight'));
    const getValue = getEnergyCalculating(type);
    return getValue(acc, valueNode);
}, {});

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
    const nutritionList = dom('ul.nutrition__list');
    const nutritionListContainer = (nutritionList.length !== 0 && nutritionList?.children()) || [];
    const ingredientsList = dom('div.ingredients-list.layout__content-col > div.ingredients-list__content >'
        + ' p.content-item');
    const stepsContainer = dom('span.instruction__description');
    const image = extractImage(imageContainer);
    const recipeTitle = titleContainer && titleContainer.text().trim();
    const portions = extractPortions(Array.from(infoContainer));
    const instructions = extractInstructions(Array.from(stepsContainer));
    const energy = extractEnergy(Array.from(nutritionListContainer));
    const ingredients = extractIngredients(Array.from(ingredientsList));
    return new Recipe(formatChars(recipeTitle), instructions, portions, ingredients, energy, image);
};
