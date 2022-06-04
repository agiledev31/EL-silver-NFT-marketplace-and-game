import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeleaderboardComponent } from './challengeleaderboard.component';

describe('ChallengeleaderboardComponent', () => {
  let component: ChallengeleaderboardComponent;
  let fixture: ComponentFixture<ChallengeleaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengeleaderboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeleaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
