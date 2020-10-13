import fs from 'fs';
import path from 'path';
import data from '../__mocks__/mock-recipes';
import parseRecipe from '../src/parseRecipe';
import { describe, expect } from '@jest/globals';

const fixtures = '__fixtures__';
const fixtureTemplate = 'get-page-by-url';

describe('Parse page and get Recipe instance', () => {
    data.forEach(async ({ name, recipe, comment }, index) => {
        test(`Test of getting recipe for: "${name}" ${comment ? ` with comment: "${comment}` : ''}"`, async () => {
            const promise = new Promise((res, rej) => {
                fs.readFile(path.join(__dirname, fixtures, `${fixtureTemplate}-${index + 1}.txt`), 'utf-8', (err, file) => {
                    if (err) rej(err);
                    res(file);
                });
            });
            try {
                const snapshot = await promise;
                const result = parseRecipe(snapshot);
                expect(result).toEqual(recipe);
            } catch (e) {
                throw new Error(e);
            }
        });
    });
});
