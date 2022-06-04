import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolChallengeComponent } from './lol-challenge.component';

describe('LolChallengeComponent', () => {
  let component: LolChallengeComponent;
  let fixture: ComponentFixture<LolChallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LolChallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LolChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
