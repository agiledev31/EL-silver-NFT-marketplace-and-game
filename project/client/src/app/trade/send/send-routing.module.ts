import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SendLayoutComponent } from './send-layout/send-layout.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';

const routes: Routes = [
  {
    path: '',
    component: SendLayoutComponent,
    children: [
      { path: '1', component: Step1Component },
      { path: '2', component: Step2Component },
      { path: '', redirectTo: '1', pathMatch: 'full' },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SendRoutingModule {}
