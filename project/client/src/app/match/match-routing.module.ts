import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FiveVFiveComponent } from './five-vfive/five-vfive.component';
import { MatchSetupComponent } from './match-setup/match-setup.component';
import { MatchComponent } from './match/match.component';
import { SetupLayoutComponent } from './setup-layout/setup-layout.component';
import { SoloComponent } from './solo/solo.component';

const routes: Routes = [
  {
    path: 'setup',
    component: SetupLayoutComponent, children: [
      { path: '', component: MatchSetupComponent },
      { path: 'solo', component: SoloComponent },
      { path: 'lobby/:id', component: FiveVFiveComponent },
      { path: '5v5', component: FiveVFiveComponent },

    ]


  },
  { path: ':id', component: MatchComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchRoutingModule {}
