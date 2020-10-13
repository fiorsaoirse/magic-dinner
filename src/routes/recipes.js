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
    } catch (error) {
        console.error(error);
        res.status(500);
        res.json({ error });
        res.end();
    }
});

export default router;
