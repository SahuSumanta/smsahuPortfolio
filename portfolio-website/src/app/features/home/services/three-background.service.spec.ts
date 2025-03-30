import { TestBed } from '@angular/core/testing';

import { ThreeBackgroundService } from './three-background.service';

describe('ThreeBackgroundService', () => {
  let service: ThreeBackgroundService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreeBackgroundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
