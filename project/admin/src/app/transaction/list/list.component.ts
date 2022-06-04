import { Component, OnInit } from '@angular/core';
import { TradeService } from './../../core/services/trade.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  page = 1;
  limit = 10;

  isLoader = false;

  result = null;
  constructor(private tradeService: TradeService) { }

  ngOnInit(): void {
    this.get();
  }
  get() {
    this.isLoader = true;
    this.tradeService.getTransactions(this.page, this.limit).subscribe((res :any)=> {
    this.isLoader = false;
      if(res.status === 200) {
        this.result = res.status === 200 ? res.data.result : null;
      }

    }, err => {
      this.isLoader = false;
      this.result = null;
    });
  }

  getMode(mode: number) {
    //1,  Buy/sell
    //2,  p2p
    if(mode === 1) {
      return 'BUY/SELL';
    } else if(mode === 2) {
      return 'P2P';
    }else if(mode === 3) {
      return 'Win/Loss';
    }else if(mode === 4) {
      return 'Sent/Received';
    }else if(mode === 5) {
      return 'Voucher';
    } else {
      return 'From System';
    }
  }
  getModeSubType(mode: number, subType: number) {
    if(mode == 1 || mode == 2) {
      return subType == 1 ? 'Buy': 'Sell';
    } else if(mode == 3) {
      return subType == 1 ? 'WIN': 'LOSS';
    } else if(mode == 4) {
      return subType == 1 ? 'RECEIVED': 'SENT';
    } else if(mode == 5) {
      return 'VOUCHER';
    } else {
      return '';
    }
  }

  onFilterChange() {
    this.get();
  }

  onPageChange(page){
    this.page = page;
    this.get();
  }


}




