import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../core/services';
import { SettingComponent } from './setting/setting.component';

const routes: Routes = [
  {
    path: '', children: [
      { path: 'setting', component: SettingComponent, canActivate: [AuthGuard], },
      { path: 'tournament', loadChildren: () => import('./tournament/tournament.module').then(m => m.TournamentModule), canActivate: [AuthGuard], },
      { path: 'level', loadChildren: () => import('./level/level.module').then(m => m.LevelModule), canActivate: [AuthGuard], },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameControlRoutingModule { }
