import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RechargeWalletComponent } from './recharge-wallet/recharge-wallet.component';

const routes: Routes = [

      { path: '', component: RechargeWalletComponent },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RechargeWalletRoutingModule {}
