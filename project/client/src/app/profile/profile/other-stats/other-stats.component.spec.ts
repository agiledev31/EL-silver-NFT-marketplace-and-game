import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherStatsComponent } from './other-stats.component';

describe('OtherStatsComponent', () => {
  let component: OtherStatsComponent;
  let fixture: ComponentFixture<OtherStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
