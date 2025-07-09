import { TestBed } from '@angular/core/testing';

import { CustomMatPaginatorIntl } from './custom-mat-paginator-intl';

describe('CustomMatPaginatorIntl', () => {
  let service: CustomMatPaginatorIntl;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomMatPaginatorIntl);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
