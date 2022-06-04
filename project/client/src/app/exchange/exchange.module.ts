import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExchangeRoutingModule } from './exchange-routing.module';
import { ExchangeComponent } from './exchange.component';
import { ExchangeDefaultComponent } from './exchangedefault/exchangedefault.component';

@NgModule({
  declarations: [
    ExchangeComponent,
    ExchangeDefaultComponent,
  ],
  imports: [
    CommonModule,
    ExchangeRoutingModule
  ]
})
export class ExchangeModule { }
