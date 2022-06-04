import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveVFiveComponent } from './five-vfive.component';

describe('FiveVFiveComponent', () => {
  let component: FiveVFiveComponent;
  let fixture: ComponentFixture<FiveVFiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveVFiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveVFiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
