import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiveV5InviteComponent } from './five-v5-invite.component';

describe('FiveV5InviteComponent', () => {
  let component: FiveV5InviteComponent;
  let fixture: ComponentFixture<FiveV5InviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiveV5InviteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiveV5InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
