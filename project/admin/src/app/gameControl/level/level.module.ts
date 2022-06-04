import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LevelRoutingModule } from './level-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListComponent } from './list/list.component';

@NgModule({
  imports: [
    CommonModule,
    LevelRoutingModule,
    SharedModule
  ],
  declarations: [ListComponent]
})
export class LevelModule { }
