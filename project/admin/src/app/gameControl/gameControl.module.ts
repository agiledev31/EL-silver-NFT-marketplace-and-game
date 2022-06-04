import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameControlRoutingModule } from './gamecontrol-routing.module';
import { SettingComponent } from './setting/setting.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    GameControlRoutingModule,
    SharedModule
  ],
  declarations: [SettingComponent]
})
export class GameControlModule { }
