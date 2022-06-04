import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentRoutingModule } from './tournament-routing.module';
import { ListComponent } from './list/list.component';
import { AddComponent } from './add/add.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TournamentRoutingModule,
    SharedModule
  ],
  declarations: [ListComponent, AddComponent]
})
export class TournamentModule { }
