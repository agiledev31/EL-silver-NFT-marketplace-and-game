import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShopComponent } from './shop.component';
import { ShopDefaultComponent } from './shopdefault/shopdefault.component';
import { ShopDetailsComponent } from './shopdetails/shopdetails.component';
import { ShopExchangeComponent } from './shopexchange/shopexchange.component';

@NgModule({
  declarations: [
    ShopComponent,
    ShopDefaultComponent,
    ShopDetailsComponent,
    ShopExchangeComponent,
  ],
  imports: [
    CommonModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
