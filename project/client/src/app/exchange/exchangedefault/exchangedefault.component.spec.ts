import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeDefaultComponent } from './exchangedefault.component';

describe('ExchangeDefaultComponent', () => {
  let component: ExchangeDefaultComponent;
  let fixture: ComponentFixture<ExchangeDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
