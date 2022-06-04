import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InvComponent } from './inv.component';
import { InvDefaultComponent } from './invdefault/invdefault.component';
import { InvDetailsComponent } from './invdetails/invdetails.component';

const routes: Routes = [
  {
    path:'',component:InvComponent, children:[
      {
        path:'',component: InvDefaultComponent
      },
      {
        path:'details/:id',component:InvDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InvRoutingModule { }
