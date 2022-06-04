import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllGameModesComponent } from './all-game-modes.component';

describe('AllGameModesComponent', () => {
  let component: AllGameModesComponent;
  let fixture: ComponentFixture<AllGameModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllGameModesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllGameModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
