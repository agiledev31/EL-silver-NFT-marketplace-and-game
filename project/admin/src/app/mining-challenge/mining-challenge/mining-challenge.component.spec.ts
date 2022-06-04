import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningChallengeComponent } from './mining-challenge.component';

describe('MiningChallengeComponent', () => {
  let component: MiningChallengeComponent;
  let fixture: ComponentFixture<MiningChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiningChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
