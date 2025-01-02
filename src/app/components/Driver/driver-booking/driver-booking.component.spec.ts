import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverBookingComponent } from './driver-booking.component';

describe('DriverBookingComponent', () => {
  let component: DriverBookingComponent;
  let fixture: ComponentFixture<DriverBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DriverBookingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
