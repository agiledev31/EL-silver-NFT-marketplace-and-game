import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ModeRoutingModule } from './mode-routing.module';
import { ModeComponent } from './mode.component';
import { TournamentComponent } from './tournament/tournament.component';
import { DetailComponent } from './detail/detail.component';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { MatchesComponent } from './matches/matches.component';
import { TeamsComponent } from './teams/teams.component';
import { TournamentSearchComponent } from './tournament-search/tournament-search.component';
import { JoinComponent } from './modals/join/join.component';
import { InitiatedComponent } from './modals/initiated/initiated.component';
import { SuccessComponent } from './modals/success/success.component';
import { BracketComponent } from './matches/bracket/bracket.component';
import { BracketTeamComponent } from './matches/bracket/bracket-team/bracket-team.component';
import { LolChallengeComponent } from './lolchallenge/lolchallenge/lolchallenge.component';
import { LolChallengeLayoutComponent } from './lolchallenge/lolchallenge-layout/lolchallenge-layout.component';
import { LolChallengeHistoryComponent } from './lolchallenge/lolchallengehistory/lolchallengehistory.component';
import { ClaimRewardComponent } from './lolchallenge/claim-reward/claim-reward.component';
import { LolchallengeEarningsComponent } from './lolchallenge/lolchallenge-earnings/lolchallenge-earnings.component';
import { ConfirmComponent } from '../shared/confirm/confirm.component';
import { InviteComponent } from '../shared/invite/invite.component';


@NgModule({
  declarations: [ModeComponent, TournamentComponent, DetailComponent, MatchesComponent, TeamsComponent, 
    TournamentSearchComponent, JoinComponent, InitiatedComponent, SuccessComponent,
     LolChallengeComponent,LolChallengeLayoutComponent, LolChallengeHistoryComponent,
    ClaimRewardComponent, LolchallengeEarningsComponent, BracketComponent, BracketTeamComponent],
  imports: [
    CommonModule,
    ModeRoutingModule,
    SharedModule,
    NgxSlickJsModule.forRoot({
      links: {
        jquery: "https://code.jquery.com/jquery-3.4.0.min.js",
        slickJs:
          "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
        slickCss:
          "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
        slickThemeCss:
          "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css",
      }
    })
  ]
})
export class ModeModule { }
