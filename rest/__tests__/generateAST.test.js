import fs from 'fs';
import path from 'path';
import ast from '../src/ast';
import data from '../__mocks__/mock-parsed-data';
import dataWithDefaults from '../__mocks__/mock-recipes-with-default-params';

const fixtures = '__fixtures__';
const oneElement = 'one-element.txt';
const html = 'mock-get-page.txt';
const htmlWithDefault = 'mock-get-page-def.txt';

const slicedData = data.slice(0, 1);

class TestData {
  constructor(description, source, expected) {
    this.description = description;
    this.source = source;
    this.expected = expected;
  }
}

const testData = [
  new TestData('Parse HTML with one element and generate AST', oneElement, slicedData),
  new TestData('Parse HTML with some recipes and generate AST', html, data),
  new TestData('Parse HTML with some recipes which doesn\'t have recipes and generate AST', htmlWithDefault, dataWithDefaults),
];

describe('Testing of generating AST', () => {
  testData.forEach(({ description, source, expected }) => {
    test(description, async () => {
      const promise = new Promise((res, rej) => {
        fs.readFile(path.join(__dirname, fixtures, source), 'utf-8', (err, file) => {
          if (err) rej(err);
          res(file);
        });
      });

      const snapshot = await promise;
      const result = ast(snapshot);

      expect(result).toEqual(expected);
    });
  });
});
