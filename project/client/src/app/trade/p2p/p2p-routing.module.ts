import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './detail/detail.component';
import { ListComponent } from './list/list.component';
import { P2pLayoutComponent } from './p2p-layout/p2p-layout.component';
import { RequestComponent } from './request/request.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent,
  },
  {
    path: ':id',
    component: DetailComponent,
  },
  {
    path: ':id/request/:requestId',
    component: RequestComponent,
  },
  {
    path: 'sell',
    component: P2pLayoutComponent,
    children: [
      { path: '1', component: Step1Component },
      { path: '2', component: Step2Component },
      { path: '3', component: Step3Component },
      { path: '4', component: Step4Component },
      { path: '5', component: Step5Component },
      { path: '6', component: Step6Component },
      { path: '', redirectTo: '1', pathMatch: 'full' },

    ],
  },
  {
    path: 'buy',
    component: P2pLayoutComponent,
    children: [
      { path: '1', component: Step1Component },
      { path: '2', component: Step2Component },
      { path: '3', component: Step3Component },
      { path: '4', component: Step4Component },
      { path: '5', component: Step5Component },
      { path: '6', component: Step6Component },
      { path: '', redirectTo: '1', pathMatch: 'full' },

    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule],
})
export class P2pRoutingModule {}
