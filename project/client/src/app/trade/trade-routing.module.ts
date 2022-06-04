import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstantComponent } from './instant/instant.component';
import { TradeComponent } from './trade/trade.component';



const routes: Routes = [
  {path: '', component: TradeComponent},
  {path: 'instant/:type', component: InstantComponent},
  {path: 'instant', redirectTo: 'instant/buy', pathMatch: 'full'},
  {path: 'p2p', loadChildren: () => import('./p2p/p2p.module').then(m => m.P2pModule)},
  {path: 'post', loadChildren: () => import('./post/post.module').then(m => m.PostModule)},
  {path: 'send', loadChildren: () => import('./send/send.module').then(m => m.SendModule)},
  {path: 'history', loadChildren: () => import('./history/history.module').then(m => m.HistoryModule)},
  {path: 'recharge', loadChildren: () => import('./recharge-wallet/recharge-wallet.module').then(m => m.RechargeWalletModule)},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class TradeRoutingModule { }
