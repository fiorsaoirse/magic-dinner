import express from 'express';
import request from 'request-promise-native';
import ast from '../ast';
import parseRecipe from '../parseRecipe';

const router = express.Router();

// const getRecipesCountAddress = 'https://eda.ru/RecipesCatalog/GetRecipesCount';
const getPageAddress = 'https://eda.ru/RecipesCatalog/GetPage';
const findByNameAddress = 'https://eda.ru/Ingredient/FindByName';
const baseURL = 'https://eda.ru';

/*   --- INGREDIENTS REQUEST ---   */
router.get('/ingredients/find', async (req, res) => {
  const { term } = req.query;
  try {
    const result = await request.get({
      uri: findByNameAddress,
      useQuerystring: true,
      qs: { term: decodeURIComponent(term) },
    });
    res.json({ data: JSON.parse(result) });
    res.end();
  } catch (e) {
    res.status(500);
    res.json({ error: e });
    res.end();
  }
});

/*   --- PAGES REQUEST ---   */
router.post('/pages', async (req, res) => {
  const { body } = req;
  try {
    const result = await request.post({
      uri: getPageAddress,
      form: body,
    });

    const parsedResult = JSON.parse(result);
    const html = parsedResult.Recipes;
    const total = parseInt(parsedResult.TotalCount, 10);
    const generatedAST = ast(html);

    res.json({ total, data: generatedAST });
    res.end();
  } catch (e) {
    res.status(500);
    res.json({ error: e });
    res.end();
  }
});

router.post('/pages/count', async (req, res) => {
  // const { body } = req;
  try {
    // Something
  } catch (e) {
    res.status(500);
    res.json({ error: e });
    res.end();
  }
});

/*   --- RECIPES REQUEST ---   */
router.get('/recipes/get', async (req, res) => {
  try {
    const { link } = req.query;
    const result = await request.get({
      uri: baseURL + link,
    });
    const recipe = parseRecipe(result);
    res.json(recipe);
  } catch (e) {
    res.status(500);
    res.json({ error: e });
    res.end();
  }
});

export default router;
