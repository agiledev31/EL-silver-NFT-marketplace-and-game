import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WinRatePositionComponent } from './win-rate-position.component';

describe('WinRatePositionComponent', () => {
  let component: WinRatePositionComponent;
  let fixture: ComponentFixture<WinRatePositionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WinRatePositionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WinRatePositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
