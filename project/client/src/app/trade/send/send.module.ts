import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { SendRoutingModule } from './send-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SendLayoutComponent } from './send-layout/send-layout.component';



@NgModule({
  declarations: [SendLayoutComponent, Step1Component, Step2Component],
  imports: [
    CommonModule,
    SendRoutingModule,
    SharedModule
  ]
})
export class SendModule { }
