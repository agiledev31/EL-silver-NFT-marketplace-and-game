import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyDetailsComponent } from './academy-details.component';

describe('AcademyDetailsComponent', () => {
  let component: AcademyDetailsComponent;
  let fixture: ComponentFixture<AcademyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
