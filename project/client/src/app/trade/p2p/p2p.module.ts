import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { P2pLayoutComponent } from './p2p-layout/p2p-layout.component';
import { P2pRoutingModule } from './p2p-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { Step3Component } from './step3/step3.component';
import { Step4Component } from './step4/step4.component';
import { Step5Component } from './step5/step5.component';
import { Step6Component } from './step6/step6.component';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { RequestComponent } from './request/request.component';


@NgModule({
  declarations: [P2pLayoutComponent, Step1Component, Step2Component, Step3Component, Step4Component, Step5Component, Step6Component, ListComponent, DetailComponent, RequestComponent],
  imports: [
    CommonModule,
    P2pRoutingModule,
    SharedModule,
  ]
})
export class P2pModule { }
