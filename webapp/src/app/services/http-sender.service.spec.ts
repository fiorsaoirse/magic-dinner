import { TestBed } from '@angular/core/testing';

import { HttpSenderService } from './http-sender.service';

describe('HttpSenderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpSenderService = TestBed.get(HttpSenderService);
    expect(service).toBeTruthy();
  });
});
