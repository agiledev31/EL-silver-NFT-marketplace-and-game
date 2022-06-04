import { Component, OnInit } from '@angular/core';
import { TradeService } from 'src/app/core/services/trade.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {


  filter = {
    page: 1,
    limit: 10,
    type : 0,
    subType: 0,
    query: '',
    sort : -1
  }
sorting = [
      { value: 1, name: 'Newest to Oldest' },
      { value: -1, name: 'Oldest to Newest' }
  ];

isLoader  = false;
result: any = null;

  constructor(private tradeService: TradeService) { }

  ngOnInit(): void {
    this.get();
  }
  get() {
    // call the api here
    this.isLoader = true;
    this.tradeService.getTransactions(this.filter).subscribe(
      (res:any) => {
        if(res.status === 200) {
          this.result = res.data.result;
        } else {
          this.result = null;
        }
    this.isLoader = false;
      }, err => {
    this.isLoader = false;
        this.result = null
      }
    )
  }
  onQuerySearch() {
      this.get();
  }
  onTypeClick(type: number) {
    if(this.filter.type !== type) {
      this.filter.type = type;
      this.get();
    }
  }
  onSubTypeClick(subType: number) {
    if(this.filter.subType !== subType) {
    this.filter.subType = subType;
    this.get();
    }
  }
  onPageChange(page: number) {
    this.filter.page = page;
    this.get();
  }
  getMode(mode: number) {
    //1,  Buy/sell
    //2,  p2p
    if(mode === 1) {
      return 'BUY/SELL';
    } else if(mode === 2) {
      return 'P2P';
    } else {
      return '';
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
}
