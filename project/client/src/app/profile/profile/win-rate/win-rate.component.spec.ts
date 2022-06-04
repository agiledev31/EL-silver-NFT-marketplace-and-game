import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinRateComponent } from './win-rate.component';

describe('WinRateComponent', () => {
  let component: WinRateComponent;
  let fixture: ComponentFixture<WinRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinRateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
