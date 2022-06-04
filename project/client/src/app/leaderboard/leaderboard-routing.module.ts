import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from './leaderboard.component';
import {TopPlayerChallangesComponent} from './top-player-challanges/top-player-challanges.component';

const routes: Routes = [
  {path: '', component: LeaderboardComponent},
  {path: 'topPlayerChallenges', component: TopPlayerChallangesComponent},

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class LeaderboardRoutingModule { }
