import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiningchallengeRoutingModule } from './miningchallenge-routing.module';
import { MiningchallengeComponent } from './miningchallenge/miningchallenge.component';
import { ChallengeleaderboardComponent } from './challengeleaderboard/challengeleaderboard.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MiningchallengeComponent, ChallengeleaderboardComponent],
  imports: [
    CommonModule,
    MiningchallengeRoutingModule,
    SharedModule
  ]
})
export class MiningchallengeModule { }
