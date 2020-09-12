import cheerio from 'cheerio';
import { findByPredicate, reduceNode } from './nodesOperations';
import Recipe from './entities/classes/recipe';
import Ingredient from './entities/classes/ingredient';
import { formatText, isTagNode, isTextNode } from './utils/utils';

const extractValue = (node) => {
    const data = reduceNode((innerAcc, innerNode) => {
        let newInnerAcc = innerAcc.slice();
        if (isTextNode(innerNode)) {
            newInnerAcc += innerNode.data.trim();
        }
        return newInnerAcc;
    }, node, '');
    if (!data) {
        throw new Error('Error during parsing nutrition: can\'t define data value');
    }
    return parseFloat(data.replace(',', '.'));
};

/* eslint-disable quote-props */
// noinspection NonAsciiCharacters
const energyType = {
    'калорийность': (obj, node) => {
        const result = { ...obj };
        result.calories = extractValue(node);
        return result;
    },
    'белки': (obj, node) => {
        const result = { ...obj };
        result.proteins = extractValue(node);
        return result;
    },
    'жиры': (obj, node) => {
        const result = { ...obj };
        result.fat = extractValue(node);
        return result;
    },
    'углеводы': (obj, node) => {
        const result = { ...obj };
        result.carbs = extractValue(node);
        return result;
    },
};

export default (html) => {
    const $ = cheerio.load(html);
    const $recipeTitle = $('h1.recipe__name');
    const $recipeImageContainer = $('div.recipe__cover').get(0);
    const $info = $('div.recipe__info-pad');
    const $nutritionListContainer = $('ul.nutrition__list');
    const $nutritionList = ($nutritionListContainer.length !== 0 && $nutritionListContainer?.children()) || [];
    const $ingredientsList = $('div.ingredients-list.layout__content-col > div.ingredients-list__content >'
        + ' p.content-item');
    const $steps = $('span.instruction__description');
    // Get image
    const previewRE = new RegExp('preview', 'gm');
    const imageNode = findByPredicate((currentNode) => {
        if (!isTagNode(currentNode)) return false;
        const { name, parent: { attribs: { 'class': classList } } } = currentNode;
        if (classList && previewRE.test(classList)) return false;
        return name === 'img' || name === 'image';
    }, $recipeImageContainer);
    const image = imageNode?.attribs?.src || imageNode?.attribs?.href;
    // Get entities title
    const recipeTitle = $recipeTitle && $recipeTitle.text().trim();
    // Get portion count
    const portions = Array.from($info).reduce((acc, node) => {
        const result = reduceNode((nAcc, currentNode) => {
            if (currentNode.type === 'text' && currentNode.parent.name === 'span'
                && currentNode.parent.attribs.class.includes('js-portions-count-print')) {
                return currentNode.data.trim();
            }
            return nAcc;
        }, node, '');
        if (!result) return acc;
        return acc.concat(result);
    }, '');
    // Get instructions
    const text = Array.from($steps)
        .map(({ children }) => {
            const mappedChildren = children.map((child) => reduceNode((innerAcc, innerNode) => {
                let newInnerAcc = [...innerAcc];
                if (innerNode.type === 'text') {
                    const data = innerNode.data.trim();
                    if (!!data && !data.match(/^(\d+\.)/)) {
                        newInnerAcc = [...newInnerAcc, formatText(innerNode.data.trim())];
                    }
                }
                return newInnerAcc;
            }, child, []));
            return mappedChildren.reduce((acc, child) => [...acc, ...child]).join(' ');
        });

    // Get nutrition params
    const energy = $nutritionList.length > 0
        && Array.from($nutritionList).reduce((acc, nutrition) => {
            const childTags = nutrition.children.filter((child) => child.type === 'tag');
            // Define type of nutrition
            const typeNode = childTags.find((child) => child.attribs.class.includes('nutrition__name'));
            const type = typeNode.children.map((curr) => curr.data.trim()).join().toLowerCase();
            const valueNode = childTags.find((child) => child.attribs.class.includes('nutrition__weight'));
            const func = energyType[type];
            return func(acc, valueNode);
        }, {});

    // Get ingredients
    const ingredients = Array.from($ingredientsList).reduce((acc, curr) => {
        const dataIngredient = curr.attribs['data-ingredient-object'];
        if (!dataIngredient && !dataIngredient.length) return acc;
        try {
            const parsedDataIngredient = JSON.parse(dataIngredient);
            const ingredient = new Ingredient(parsedDataIngredient.name.trim(),
                parsedDataIngredient.amount.trim());
            return [...acc, ingredient];
        } catch (e) {
            console.error(`Error during parsing ingredients: ${e}`);
            throw new Error(e);
        }
    }, []);

    return new Recipe(formatText(recipeTitle), text, portions, ingredients, energy, image);
};
