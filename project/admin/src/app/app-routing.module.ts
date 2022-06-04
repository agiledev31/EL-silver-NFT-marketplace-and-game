import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core';
import { NoAuthGuard } from './core/services/no-auth-guard.service';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule), canActivate: [NoAuthGuard] },
  {
    path: '', component: LayoutComponent, children: [
      { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule), canActivate: [AuthGuard], },
      { path: 'users', loadChildren: () => import('./users/users.module').then(m => m.UsersModule), canActivate: [AuthGuard], },
      { path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard], },
      { path: 'control', loadChildren: () => import('./gameControl/gameControl.module').then(m => m.GameControlModule), canActivate: [AuthGuard], },
      { path: 'voucher', loadChildren: () => import('./voucher/voucher.module').then(m => m.VoucherModule), canActivate: [AuthGuard], },
      { path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then(m => m.TransactionModule), canActivate: [AuthGuard], },
      { path: 'p2p', loadChildren: () => import('./p2p-post/p2p-post.module').then(m => m.P2pPostModule), canActivate: [AuthGuard], },
      { path: 'mining-challenge', loadChildren: () => import('./mining-challenge/mining-challenge.module').then(m => m.MiningChallengeModule), canActivate: [AuthGuard], },
      { path: 'lolchallenge', loadChildren: () => import('./lolchallenge/lolchallenge.module').then(m => m.LolChallengeModule), canActivate: [AuthGuard], },
      { path: '', redirectTo: '/auth', pathMatch: 'full' },
      { path: 'announcement', loadChildren: () => import('./announcement/announcement.module').then(m => m.AnnouncementModule), canActivate: [AuthGuard] },
      { path: 'nft', loadChildren: () => import('./nft/nft.module').then(m => m.NftModule), canActivate: [AuthGuard] }
    ]
  },
  { path: '**', redirectTo: '/auth', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
