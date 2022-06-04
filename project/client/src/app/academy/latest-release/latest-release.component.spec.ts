import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestReleaseComponent } from './latest-release.component';

describe('LatestReleaseComponent', () => {
  let component: LatestReleaseComponent;
  let fixture: ComponentFixture<LatestReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestReleaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
