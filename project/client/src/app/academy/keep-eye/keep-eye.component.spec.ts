import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeepEyeComponent } from './keep-eye.component';

describe('KeepEyeComponent', () => {
  let component: KeepEyeComponent;
  let fixture: ComponentFixture<KeepEyeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KeepEyeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KeepEyeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
