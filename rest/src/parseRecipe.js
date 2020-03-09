import cheerio from 'cheerio';
import { reduceNode } from './nodesOperations';
import Recipe from './entities/classes/recipe';
import Ingredient from './entities/classes/ingredient';

const extractValue = (node) => {
  const data = node.children.map((child) => child.data.trim()).join('').replace(',', '.');
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
  const $info = $('div.recipe__info-pad').children();
  const $nutritionList = $('ul.nutrition__list').children();
  const $ingredientsList = $('div.ingredients-list.layout__content-col > div.ingredients-list__content >'
    + ' p.content-item');
  const $steps = $('li.instruction > div.instruction__wrap > span.instruction__description');

  // Get entities title
  const recipeTitle = $recipeTitle && $recipeTitle.text().trim();

  const infoNodes = Array.from($info);

  // Get portion count
  const portions = infoNodes.map((node) => reduceNode((acc, curr) => {
    // TODO: надо тут отфильтровать ноды и
    // выдрать количество порций - редьюс не совсем подходит ['text', '', '', '']
    if (curr.type === 'text' && curr.parent.name === 'span' && curr.parent.attribs.class.includes('js-portions-count-print')) {
      return [...acc, curr.data.trim()];
    }
    return [...acc];
  }, node, '')).filter((v) => v !== '').join('');

  const stepsNodes = Array.from($steps);

  // Get text of entities
  const text = stepsNodes.reduce((acc, step) => reduceNode((nAcc, curr) => {
    if (curr.type === 'text' && curr.data.trim() !== '' && !curr.data.trim().match(/^(\d\.)/)) { // RegExp check is
      // for not to include parsed number of step
      return [...nAcc, curr.data.trim()];
    }
    return nAcc;
  }, step, acc),
  []);

  const nutritionList = Array.from($nutritionList);

  // Get nutrition params
  const energy = nutritionList.reduce((acc, nutrition) => {
    const childTags = nutrition.children.filter((child) => child.type === 'tag');
    const typeNode = childTags.find((child) => child.attribs.class.includes('nutrition__name'));
    const valueNode = childTags.find((child) => child.attribs.class.includes('nutrition__weight'));
    const type = typeNode.children.map((curr) => curr.data.trim()).join().toLowerCase();
    const func = energyType[type];
    return func(acc, valueNode);
  }, {});

  const ingredientsList = Array.from($ingredientsList);

  // Get ingredients
  const ingredients = ingredientsList.reduce((acc, curr) => {
    const dataIngredient = curr.attribs['data-ingredient-object'];
    try {
      const parsedDataIngredient = JSON.parse(dataIngredient);
      const ingredient = new Ingredient(parsedDataIngredient.name.trim(),
        parsedDataIngredient.amount.trim());
      return [...acc, ingredient];
    } catch (e) {
      throw new Error(e);
    }
  }, []);

  return new Recipe(recipeTitle, text, portions, ingredients, ...Object.values(energy));
};
