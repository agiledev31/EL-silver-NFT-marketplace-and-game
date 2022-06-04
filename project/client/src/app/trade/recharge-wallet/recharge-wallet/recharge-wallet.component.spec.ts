import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechargeWalletComponent } from './recharge-wallet.component';

describe('RechargeWalletComponent', () => {
  let component: RechargeWalletComponent;
  let fixture: ComponentFixture<RechargeWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechargeWalletComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RechargeWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
