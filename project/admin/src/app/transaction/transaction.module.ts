import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { TransactionRoutingModule } from './transaction-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, TransactionRoutingModule, SharedModule],
})
export class TransactionModule {}
