import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopDefaultComponent } from './shopdefault.component';

describe('ShopDefaultComponent', () => {
  let component: ShopDefaultComponent;
  let fixture: ComponentFixture<ShopDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
