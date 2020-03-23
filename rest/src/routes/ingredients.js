import express from 'express';
import request from 'request-promise-native';

const router = express.Router();

const findByNameAddress = 'https://eda.ru/Ingredient/FindByName';

router.get('/find', async (req, res) => {
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

export default router;
