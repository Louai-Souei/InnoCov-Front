import { TestBed } from '@angular/core/testing';

import { RouteBookingService } from './route-booking.service';

describe('RouteBookingService', () => {
  let service: RouteBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
