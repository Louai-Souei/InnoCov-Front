import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PassengerStatsComponent } from './passenger-stats.component';

describe('PassengerStatsComponent', () => {
  let component: PassengerStatsComponent;
  let fixture: ComponentFixture<PassengerStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PassengerStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PassengerStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
