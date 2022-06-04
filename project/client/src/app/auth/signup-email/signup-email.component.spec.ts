import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupEmailComponent } from './signup-email.component';

describe('SignupEmailComponent', () => {
  let component: SignupEmailComponent;
  let fixture: ComponentFixture<SignupEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupEmailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
