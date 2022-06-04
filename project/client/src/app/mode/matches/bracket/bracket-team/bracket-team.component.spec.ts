import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BracketTeamComponent } from './bracket-team.component';

describe('BracketTeamComponent', () => {
  let component: BracketTeamComponent;
  let fixture: ComponentFixture<BracketTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BracketTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BracketTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
