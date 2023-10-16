import { TestBed } from '@angular/core/testing';

import { CatService } from './catService';

describe('CatService', () => {
  let service: CatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
