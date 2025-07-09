import { TestBed } from '@angular/core/testing';

import { RowTrackerService } from './row-tracker.service';

describe('RowTrackerService', () => {
  let service: RowTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RowTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
