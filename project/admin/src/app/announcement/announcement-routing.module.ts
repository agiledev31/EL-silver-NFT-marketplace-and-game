import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list/list.component';
import { AddEditAnnouncementComponent } from './add-edit-announcement/add-edit-announcement.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'generate', component: AddEditAnnouncementComponent },
  { path: ':id', component: AddEditAnnouncementComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule { }
