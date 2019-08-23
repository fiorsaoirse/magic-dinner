import express from 'express';
import request from 'request-promise-native';
import ast from '../ast';

const router = express.Router();

// const getRecipesCountAddress = 'https://eda.ru/RecipesCatalog/GetRecipesCount';
const getPageAddress = 'https://eda.ru/RecipesCatalog/GetPage';
const findByNameAddress = 'https://eda.ru/Ingredient/FindByName';

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

router.post('/pages', async (req, res) => {
  const { body } = req;
  try {
    const result = await request.post({
      uri: getPageAddress,
      form: body,
    });

    const parsedResult = JSON.parse(result);
    const html = parsedResult.Recipes;
    const generatedAST = ast(html);

    res.json({ data: generatedAST });
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

export default router;
