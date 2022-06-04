import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ListComponent } from './list/list.component';
import { AddEditAnnouncementComponent } from './add-edit-announcement/add-edit-announcement.component';


@NgModule({
  declarations: [ListComponent, AddEditAnnouncementComponent],
  imports: [
    CommonModule,
    AnnouncementRoutingModule,
    SharedModule
  ]
})
export class AnnouncementModule { }
