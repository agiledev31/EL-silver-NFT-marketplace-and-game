import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FriendsComponent } from './friends/friends.component';
import { ProfileComponent } from './profile/profile.component';
import { RecentComponent } from './recent/recent.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { ReferralsComponent } from './referrals/referrals.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileLayoutComponent,
    children: [
      { path: '', component: ProfileComponent },
      { path: 'recent', component: RecentComponent },
      { path: 'friends', component: FriendsComponent },
      { path: 'referrals', component: ReferralsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
