import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './core';
import { NoAuthGuard } from './core/services/no-auth-guard.service';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'leaderboard',
        loadChildren: () =>
          import('./leaderboard/leaderboard.module').then(
            (m) => m.LeaderboardModule
          ),
      },
      {
        path: 'miningchallenge',
        loadChildren: () =>
          import('./miningchallenge/miningchallenge.module').then(
            (m) => m.MiningchallengeModule
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./auth/auth.module').then((m) => m.AuthModule),
        canActivate: [NoAuthGuard],
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./profile/profile.module').then((m) => m.ProfileModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'trade',
        loadChildren: () =>
          import('./trade/trade.module').then((m) => m.TradeModule),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./chat/chat.module').then((m) => m.ChatModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'mode',
        loadChildren: () =>
          import('./mode/mode.module').then((m) => m.ModeModule),
      },
      {
        path: 'academy',
        loadChildren: () =>
          import('./academy/academy.module').then((m) => m.AcademyModule),
      },
      {
        path: 'nft',
        loadChildren: () => import('./nft/nft.module').then((m) => m.NFTModule),
      },
      {
        path: 'inv',
        loadChildren: () => import('./inv/inv.module').then((m) => m.InvModule),
      },
      {
        path: 'exchange',
        loadChildren: () => import('./exchange/exchange.module').then((m) => m.ExchangeModule),
      },
    ],
  },
  {
    path: 'match',
    loadChildren: () =>
      import('./match/match.module').then((m) => m.MatchModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
