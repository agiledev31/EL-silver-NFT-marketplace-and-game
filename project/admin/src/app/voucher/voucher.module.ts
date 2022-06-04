import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { VoucherRoutingModule } from './voucher-routing.module';
import { GenerateComponent } from './generate/generate.component';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [GenerateComponent, ListComponent],
  imports: [
CommonModule,
    VoucherRoutingModule,
    SharedModule
  ]
})
export class VoucherModule { }
