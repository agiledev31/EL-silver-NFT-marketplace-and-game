import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConstantService, TradeService } from 'src/app/core';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  filter = {
    type: 1,
    country: null,
paymentMethod: null,
sort: 1,
query: '',
page: 1,
limit: 10
  }

  isLoader = false;
  result: any= null;

  sorting = [
    { value: 1, name: 'Newest to Oldest' },
    { value: -1, name: 'Oldest to Newest' }
];
  constructor(
    private route: ActivatedRoute,
     private router: Router,
    public constant: ConstantService,
    public tradeService: TradeService
    ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      if (params.trade === 'buy') {
        this.filter.type = 1;
      } else if (params.trade === 'sell') {
        this.filter.type = 2;
      } else if (params.trade === 'manage-buy') {
        this.filter.type = 3;
      } else if (params.trade === 'manage-sell') {
        this.filter.type = 4;
      }
      this.get();
    });
  }
  navChanged(event: number) {
    this.filter.type = event;
    let trade = '';
    if (this.filter.type === 1) {
      trade = 'buy';
    } else if (this.filter.type === 2) {
      trade = 'sell';
    } else if (this.filter.type === 3) {
      trade = 'manage-buy';
    } else if (this.filter.type === 4) {
      trade = 'manage-sell';
    }
    this.router.navigate([], { queryParams: {trade: trade}, relativeTo: this.route });
  }

  get() {
    this.isLoader = true;
    if(this.filter.country === 0){this.filter.country = null;}
    if(this.filter.paymentMethod === 0){this.filter.paymentMethod = null;}
    this.tradeService.getP2PTrades(this.filter).subscribe(res => {
      this.isLoader = false;
      if(res.status === 200) {
        this.result = res.data.result;
      } else {
        this.result = null;
      }
    }, err => {
      this.isLoader = false;
      this.result = null;
    })
  }
}
