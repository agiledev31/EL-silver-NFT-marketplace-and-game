import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardRoutingModule } from './leaderboard-routing.module';
import { SharedModule } from '../shared/shared.module';
import { LeaderboardComponent } from './leaderboard.component';
import { AllGameModesComponent } from './all-game-modes/all-game-modes.component';
import { LolChallengeComponent } from './lol-challenge/lol-challenge.component';
import { LeadersBoxesComponent } from './leaders-boxes/leaders-boxes.component';
import { TopPlayerChallangesComponent } from './top-player-challanges/top-player-challanges.component';

@NgModule({
  declarations: [ LeaderboardComponent, AllGameModesComponent, LolChallengeComponent, LeadersBoxesComponent, TopPlayerChallangesComponent],
  imports: [
    CommonModule,
    LeaderboardRoutingModule,
    SharedModule
  ]
})
export class LeaderboardModule { }
