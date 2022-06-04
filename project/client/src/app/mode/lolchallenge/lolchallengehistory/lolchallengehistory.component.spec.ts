import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolChallengeHistoryComponent } from './lolchallengehistory.component';

describe('LolChallengeHistoryComponent', () => {
  let component: LolChallengeHistoryComponent;
  let fixture: ComponentFixture<LolChallengeHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LolChallengeHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LolChallengeHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
