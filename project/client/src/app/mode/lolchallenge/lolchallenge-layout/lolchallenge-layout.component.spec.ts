import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LolChallengeLayoutComponent } from './lolchallenge-layout.component';

describe('LolChallengeLayoutComponent', () => {
  let component: LolChallengeLayoutComponent;
  let fixture: ComponentFixture<LolChallengeLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LolChallengeLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LolChallengeLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
