import data from "../__mocks__/mock-recipes";
import fs from "fs";
import path from "path";
import parseRecipe from "../src/parseRecipe";

const fixtures = '__fixtures__';
const fixtureTemplate = 'mock-get-page-by-url';

describe('Parse page and get Recipe instance', () => {
  data.forEach(async ({ name, recipe }, index) => {
    test(`Test of getting recipe for: ${name}`, async () => {
      const promise = new Promise((res, rej) => {
        fs.readFile(path.join(__dirname, fixtures, `${fixtureTemplate}-${index + 1}.txt`), 'utf-8', (err, data) => {
          if (err) rej(err);
          res(data);
        })
      });

      const snapshot = await promise;
      const result = parseRecipe(snapshot);

      expect(result).toEqual(recipe);
    })
  })
});
