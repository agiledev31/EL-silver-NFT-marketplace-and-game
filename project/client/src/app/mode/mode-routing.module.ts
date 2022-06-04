import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { LolChallengeLayoutComponent } from './lolchallenge/lolchallenge-layout/lolchallenge-layout.component';
import { MatchesComponent } from './matches/matches.component';
import { ModeComponent } from './mode.component';
import { TeamsComponent } from './teams/teams.component';
import { TournamentSearchComponent } from './tournament-search/tournament-search.component';
import { TournamentComponent } from './tournament/tournament.component';


const routes: Routes = [

  { path: '', component: ModeComponent },
  { path: 'tournament', component: TournamentComponent },
  { path: 'tournament/:search', component: TournamentSearchComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'matches', component: MatchesComponent },
  { path: 'teams', component: TeamsComponent },
  { path: 'lolchallenge', component: LolChallengeLayoutComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModeRoutingModule { }
