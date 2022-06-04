import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiatedComponent } from './initiated.component';

describe('InitiatedComponent', () => {
  let component: InitiatedComponent;
  let fixture: ComponentFixture<InitiatedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiatedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
