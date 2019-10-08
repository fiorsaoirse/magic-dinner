import fs from 'fs';
import path from 'path';
import ast from '../src/ast';
import data from '../__mocks__/mock-parsed-data';
import dataWithDefaults from '../__mocks__/mock-recipes-with-default-params';

const fixtures = '__fixtures__';
const oneElement = 'one-element.txt';
const html = 'mock-get-page.txt';
const htmlWithDefault = 'mock-get-page-def.txt';

test('Parse HTML with one element and generate AST', async () => {
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

test('Parse HTML with some recipes and generate AST', async () => {
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

test('Parse HTML with some recipes which doesn\'t have images and generate AST', async () => {
  const promise = new Promise((res, rej) => {
    fs.readFile(path.join(__dirname, fixtures, htmlWithDefault), 'utf-8', (err, file) => {
      if (err) rej(err);
      res(file);
    });
  });

  const snapshot = await promise;
  const result = ast(snapshot);

  expect(result).toEqual(dataWithDefaults);
});
