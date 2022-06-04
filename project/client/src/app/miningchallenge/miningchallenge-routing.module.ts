import { MiningchallengeComponent } from './miningchallenge/miningchallenge.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '0'},
  { path: ':id', component: MiningchallengeComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiningchallengeRoutingModule { }
