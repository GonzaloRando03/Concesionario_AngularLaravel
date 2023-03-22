import { TestBed } from '@angular/core/testing';

import { CochesService } from './coches.service';

describe('CochesService', () => {
  let service: CochesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CochesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
