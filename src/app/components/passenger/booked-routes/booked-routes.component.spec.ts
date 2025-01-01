import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookedRoutesComponent } from './booked-routes.component';

describe('BookedRoutesComponent', () => {
  let component: BookedRoutesComponent;
  let fixture: ComponentFixture<BookedRoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookedRoutesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookedRoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
