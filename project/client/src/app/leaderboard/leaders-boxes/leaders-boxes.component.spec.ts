import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadersBoxesComponent } from './leaders-boxes.component';

describe('LeadersBoxesComponent', () => {
  let component: LeadersBoxesComponent;
  let fixture: ComponentFixture<LeadersBoxesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadersBoxesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadersBoxesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
