import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchRoutingModule } from './match-routing.module';
import { SharedModule } from '../shared/shared.module';
import { SetupLayoutComponent } from './setup-layout/setup-layout.component';

import { MatchComponent } from './match/match.component';
import { MatchSetupComponent } from './match-setup/match-setup.component';
import { SoloComponent } from './solo/solo.component';
import { FiveVFiveComponent } from './five-vfive/five-vfive.component';



@NgModule({
  declarations: [SetupLayoutComponent, MatchComponent, MatchSetupComponent, SoloComponent, FiveVFiveComponent, ],
  imports: [
    CommonModule,
    MatchRoutingModule,
    SharedModule,
  ],
})
export class MatchModule { }
