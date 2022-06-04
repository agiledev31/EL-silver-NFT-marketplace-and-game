import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiningChallengeRoutingModule } from './mining-challenge-routing.module';
import { MiningChallengeComponent } from './mining-challenge/mining-challenge.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [MiningChallengeComponent],
  imports: [
    CommonModule,
    MiningChallengeRoutingModule,
    SharedModule
  ]
})
export class MiningChallengeModule { }
