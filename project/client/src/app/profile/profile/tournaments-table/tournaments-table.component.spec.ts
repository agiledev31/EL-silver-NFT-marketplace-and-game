import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentsTableComponent } from './tournaments-table.component';

describe('TournamentsTableComponent', () => {
  let component: TournamentsTableComponent;
  let fixture: ComponentFixture<TournamentsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TournamentsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
