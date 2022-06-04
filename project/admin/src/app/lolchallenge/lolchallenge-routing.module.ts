import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LolChallengeComponent } from './lolchallenge/lolchallenge.component';
import { ViewComponent } from './view/view.component';
import {WithdrawalsComponent} from './withdrawals/withdrawals.component';
import {LolchallengehistoryComponent} from './lolchallenge/lolchallengehistory/lolchallengehistory.component';


const routes: Routes = [
   {path: '' , component: LolChallengeComponent},
   {path: 'view' , component: ViewComponent},
   {path: 'withdrawals' , component: WithdrawalsComponent},
   {path: 'challenge-history' , component: LolchallengehistoryComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LolChallengeRoutingModule { }
