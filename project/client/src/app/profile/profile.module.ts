import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { RecentComponent } from './recent/recent.component';
import { FriendsComponent } from './friends/friends.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { MobileProfileComponent } from './mobile-profile/mobile-profile.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { TournamentsTableComponent } from './profile/tournaments-table/tournaments-table.component';
import { ChallengesComponent } from './profile/challenges/challenges.component';
import { WinRateComponent } from './profile/win-rate/win-rate.component';
import { WinRatePositionComponent } from './profile/win-rate-position/win-rate-position.component';
import { WorldRankingComponent } from './profile/world-ranking/world-ranking.component';
import { OtherStatsComponent } from './profile/other-stats/other-stats.component';
import { ReferralsComponent } from './referrals/referrals.component';



@NgModule({
  declarations: [ProfileComponent, RecentComponent, FriendsComponent, ProfileLayoutComponent, MobileProfileComponent, TournamentsTableComponent, ChallengesComponent, WinRateComponent, WinRatePositionComponent, WorldRankingComponent, OtherStatsComponent, ReferralsComponent],
  imports: [
    CommonModule,
    SharedModule,
    ProfileRoutingModule,
    NgApexchartsModule
  ]
})
export class ProfileModule { }
