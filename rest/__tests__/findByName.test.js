import request from 'supertest';
import app from '../src/app';

import { carrot, lemon } from "../mock-data/mock-find-data";

const ingridientsArray = [{ name: 'морковь', data: carrot }, { name: 'лимон', data: lemon }];

ingridientsArray.forEach(current => {
  test(`Test for: ${current.name}`, async () => {
    const res = await request(app).get(`/findByName?term=${encodeURIComponent(current.name)}`);
    if (res.error) {
      throw error;
    }
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(current.data);
  })
});
