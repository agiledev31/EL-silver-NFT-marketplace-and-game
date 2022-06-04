import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostLayoutComponent } from './post-layout/post-layout.component';
import { Step1Component } from './step1/step1.component';
import { Step2Component } from './step2/step2.component';
import { PostRoutingModule } from './post-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [PostLayoutComponent,Step1Component, Step2Component,],
  imports: [
    CommonModule,
    PostRoutingModule,
    SharedModule
  ]
})
export class PostModule { }
