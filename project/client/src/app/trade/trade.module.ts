import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradeRoutingModule } from './trade-routing.module';
import { SharedModule } from './../shared/shared.module';
import { TradeComponent } from './trade/trade.component';
import { InstantComponent } from './instant/instant.component';
import { SilverOnlineComponent } from './silver-online/silver-online.component';
import { TradeService } from '../core/services/trade.service';



@NgModule({
  declarations: [TradeComponent, InstantComponent, SilverOnlineComponent],
  imports: [
  CommonModule,
    TradeRoutingModule,
    SharedModule
  ]
})
export class TradeModule {
  constructor(private tradeService: TradeService) {
    this.tradeService.populateSilver();
  }
}
