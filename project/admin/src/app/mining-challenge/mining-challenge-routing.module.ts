import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MiningChallengeComponent } from './mining-challenge/mining-challenge.component';

const routes: Routes = [
  { path: '', component: MiningChallengeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiningChallengeRoutingModule { }
