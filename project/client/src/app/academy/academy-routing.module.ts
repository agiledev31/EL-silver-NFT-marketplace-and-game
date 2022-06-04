import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AcademyDefaultComponent } from './academy-default/academy-default.component';
import { AcademyDetailsComponent } from './academy-details/academy-details.component';
import { AcademyComponent } from './academy.component';

const routes: Routes = [
  {
    path:'',component:AcademyComponent, children:[
      {
        path:'',component: AcademyDefaultComponent
      },
      {
        path:'details/:id',component:AcademyDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AcademyRoutingModule { }
