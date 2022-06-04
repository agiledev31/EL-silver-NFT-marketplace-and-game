import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolchallengeEarningsComponent } from './lolchallenge-earnings.component';

describe('LolchallengeEarningsComponent', () => {
  let component: LolchallengeEarningsComponent;
  let fixture: ComponentFixture<LolchallengeEarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LolchallengeEarningsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LolchallengeEarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
