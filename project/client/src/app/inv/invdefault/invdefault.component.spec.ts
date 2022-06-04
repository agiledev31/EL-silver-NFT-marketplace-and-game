import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvDefaultComponent } from './invdefault.component';

describe('InvDefaultComponent', () => {
  let component: InvDefaultComponent;
  let fixture: ComponentFixture<InvDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
