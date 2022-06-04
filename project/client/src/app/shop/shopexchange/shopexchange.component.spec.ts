import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopExchangeComponent } from './shopexchange.component';

describe('ShopExchangeComponent', () => {
  let component: ShopExchangeComponent;
  let fixture: ComponentFixture<ShopExchangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopExchangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopExchangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
