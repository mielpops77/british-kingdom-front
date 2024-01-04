import { TestBed } from '@angular/core/testing';

import { LivreOrService } from './livre-or.service';

describe('LivreOrService', () => {
  let service: LivreOrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivreOrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
