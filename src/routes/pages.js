import express from 'express';
import request from 'request-promise-native';
import getShortRecipes from '../parseShortRecipes';

const router = express.Router();

const getRecipesCountAddress = 'https://eda.ru/RecipesCatalog/GetRecipesCount';
const getPageAddress = 'https://eda.ru/RecipesCatalog/GetPage';

/*   --- PAGES REQUEST ---   */

router.post('/', async (req, res) => {
    const { body } = req;
    try {
        const result = await request.post({
            uri: getPageAddress,
            form: body,
        });
        const parsedResult = JSON.parse(result);
        const html = parsedResult.Recipes;
        const total = parseInt(parsedResult.TotalCount, 10);
        const parsedRecipes = getShortRecipes(html);
        res.json({ total, data: parsedRecipes });
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error });
        res.end();
    }
});

router.post('/count', async (req, res) => {
    const { body } = req;
    try {
        const result = await request.post({
            uri: getRecipesCountAddress,
            form: body,
        });
        const data = JSON.parse(result);
        const { total, currentUrl } = data;
        res.json({ total, currentUrl });
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error });
        res.end();
    }
});

export default router;
