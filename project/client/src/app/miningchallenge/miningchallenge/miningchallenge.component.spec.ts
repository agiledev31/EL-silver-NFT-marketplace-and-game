import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiningchallengeComponent } from './miningchallenge.component';

describe('MiningchallengeComponent', () => {
  let component: MiningchallengeComponent;
  let fixture: ComponentFixture<MiningchallengeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MiningchallengeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MiningchallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
