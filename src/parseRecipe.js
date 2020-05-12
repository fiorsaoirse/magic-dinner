import cheerio from 'cheerio';
import { findByPredicate, reduceNode } from './nodesOperations';
import Recipe from './entities/classes/recipe';
import Ingredient from './entities/classes/ingredient';

const extractValue = (node) => {
  const data = node.children.map((child) => {
    if (child.type !== 'text') return '';
    return child.data.trim();
  }).join('').replace(',', '.');
  return parseFloat(data);
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
  const $info = $('div.recipe__info-pad').children();
  const $nutritionList = $('ul.nutrition__list').children();
  const $ingredientsList = $('div.ingredients-list.layout__content-col > div.ingredients-list__content >'
    + ' p.content-item');
  const $steps = $('li.instruction > div.instruction__wrap > span.instruction__description');
  // Get image
  const imageNode = findByPredicate((currentNode) => !!(currentNode.type === 'tag' && currentNode.name === 'div' && $(currentNode).data('src')), $recipeImageContainer);
  const image = imageNode && $(imageNode).data('src');
  // Get entities title
  const recipeTitle = $recipeTitle && $recipeTitle.text().trim();
  // Get portion count
  const portions = Array.from($info).reduce((acc, node) => {
    const result = reduceNode((nAcc, currentNode) => {
      if (currentNode.type === 'text' && currentNode.parent.name === 'span' && currentNode.parent.attribs.class.includes('js-portions-count-print')) {
        return currentNode.data.trim();
      }
      return nAcc;
    }, node, '');
    if (!result) return acc;
    return acc.concat(result);
  }, '');
  // Get text of entities
  const text = Array.from($steps).reduce((acc, step) => reduceNode((nAcc, curr) => {
    if (curr.type === 'text' && curr.data.trim() !== '' && !curr.data.trim().match(/^(\d+\.)/)) { // RegExp check is
      // for not to include parsed number of step
      return [...nAcc, curr.data.trim()];
    }
    return nAcc;
  }, step, acc),
  []);
  // Get nutrition params
  const energy = Array.from($nutritionList).reduce((acc, nutrition) => {
    const childTags = nutrition.children.filter((child) => child.type === 'tag');
    const typeNode = childTags.find((child) => child.attribs.class.includes('nutrition__name'));
    const valueNode = childTags.find((child) => child.attribs.class.includes('nutrition__weight'));
    const type = typeNode.children.map((curr) => curr.data.trim()).join().toLowerCase();
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

  return new Recipe(recipeTitle, text, portions, ingredients, ...Object.values(energy), image);
};
