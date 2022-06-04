import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvDetailsComponent } from './invdetails.component';

describe('InvDetailsComponent', () => {
  let component: InvDetailsComponent;
  let fixture: ComponentFixture<InvDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
