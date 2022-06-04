import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolchallengehistoryComponent } from './lolchallengehistory.component';

describe('LolchallengehistoryComponent', () => {
  let component: LolchallengehistoryComponent;
  let fixture: ComponentFixture<LolchallengehistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LolchallengehistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LolchallengehistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
