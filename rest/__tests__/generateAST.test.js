import fs from 'fs';
import path from 'path';
import ast from '../src/ast';
import data from '../__mocks__/mock-parsed-data';

const fixtures = '__fixtures__';
const oneElement = 'one-element.txt';
const html = 'mock-get-page.txt';

test('Parse HTML with one element', async () => {
  const promise = new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, fixtures, oneElement), 'utf-8', (err, file) => {
      if (err) rej(err);
      res(file);
    });
  });

  const snapshot = await promise;
  const result = ast(snapshot);

  expect(result).toEqual(data.slice(0, 1));
});

test('Parse HTML and generate AST', async () => {
  const promise = new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, fixtures, html), 'utf-8', (err, file) => {
      if (err) rej(err);
      res(file);
    });
  });

  const snapshot = await promise;
  const result = ast(snapshot);

  expect(result).toEqual(data);
});
