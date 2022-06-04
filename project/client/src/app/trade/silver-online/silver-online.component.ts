import { Component, Input, OnInit } from '@angular/core';
import { TradeService } from './../../core/services/trade.service';

@Component({
  selector: 'app-silver-online',
  templateUrl: './silver-online.component.html',
  styleUrls: ['./silver-online.component.css'],
})
export class SilverOnlineComponent implements OnInit {
  // interval: any;
  silver: any = {};
  // gramPrice: any;
  // highPrice: any;
  // lowPrice: any;
  // prevPrice: any;
  constructor(private tradeService: TradeService) {}

  ngOnInit(): void {
    this.getSilver();
    // this.interval = setInterval(() => {
    //   this.getSilver();
    // }, 5000);
  }
  getSilver() {
    this.tradeService.currentSilver.subscribe((res: any) => {
      this.silver = res;
      console.log(this.silver)
      // this.gramPrice = (this.silver.price / 32.151).toFixed(3);
      // this.highPrice = (this.silver.high_price / 32.151).toFixed(3);
      // this.lowPrice = (this.silver.low_price / 32.151).toFixed(3);
      // this.prevPrice = (this.silver.prev_close_price / 32.151).toFixed(3);
    });

  }
  ngOnDestroy() {
    // if (this.interval) {
    //   clearInterval(this.interval);
    // }
  }
}
