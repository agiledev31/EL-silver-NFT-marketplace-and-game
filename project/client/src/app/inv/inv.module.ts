import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvRoutingModule } from './inv-routing.module';
import { InvComponent } from './inv.component';
import { InvDefaultComponent } from './invdefault/invdefault.component';
import { InvDetailsComponent } from './invdetails/invdetails.component';

@NgModule({
  declarations: [
    InvComponent,
    InvDefaultComponent,
    InvDetailsComponent
  ],
  imports: [
    CommonModule,
    InvRoutingModule
  ]
})
export class InvModule { }
