import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListComponent } from './list/list.component';
import { GenerateComponent } from './generate/generate.component';


const routes: Routes = [

    {path: '' , component: ListComponent},
    {path: 'generate' , component: GenerateComponent},
    {path: ':id' , component: GenerateComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class VoucherRoutingModule { }
