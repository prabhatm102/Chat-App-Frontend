import { TestBed } from '@angular/core/testing';

import { PreventLoggedInGuard } from './prevent-logged-in.guard';

describe('PreventLoggedInGuard', () => {
  let guard: PreventLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
