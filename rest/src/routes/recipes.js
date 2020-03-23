import express from 'express';
import request from 'request-promise-native';
import parseRecipe from '../parseRecipe';

const router = express.Router();

const baseURL = 'https://eda.ru';

/*   --- RECIPES REQUEST ---   */
router.get('/get', async (req, res) => {
  try {
    const { link } = req.query;
    const result = await request.get({
      uri: `${baseURL}${decodeURIComponent(link)}`,
    });
    const recipe = parseRecipe(result);
    res.json(recipe);
  } catch (e) {
    console.log('errr', e);
    res.status(500);
    res.json({ e });
    res.end();
  }
});

export default router;
