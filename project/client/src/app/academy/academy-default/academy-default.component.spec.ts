import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyDefaultComponent } from './academy-default.component';

describe('AcademyDefaultComponent', () => {
  let component: AcademyDefaultComponent;
  let fixture: ComponentFixture<AcademyDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcademyDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademyDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
