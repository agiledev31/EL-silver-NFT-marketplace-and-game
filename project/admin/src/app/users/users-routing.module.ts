import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './add/add.component';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [

    {path: '' , component: ListComponent},
    {path: 'add' , component: AddComponent},
    {path: 'detail' , component: DetailComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
