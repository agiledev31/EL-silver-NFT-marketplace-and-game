import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RechargeWalletRoutingModule } from './recharge-wallet-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RechargeWalletComponent } from './recharge-wallet/recharge-wallet.component';



@NgModule({
  declarations: [RechargeWalletComponent],
  imports: [
    CommonModule,
    RechargeWalletRoutingModule,
    SharedModule
  ]
})
export class RechargeWalletModule { }
