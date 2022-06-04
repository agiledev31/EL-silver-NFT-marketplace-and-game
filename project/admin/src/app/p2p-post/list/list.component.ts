import { Component, OnInit } from '@angular/core';
import { TradeService } from 'src/app/core/services/trade.service';


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
    this.tradeService.getP2PPost(this.page, this.limit).subscribe((res :any)=> {
    this.isLoader = false;
      if(res.status === 200) {
        this.result = res.status === 200 ? res.data.result : null;
      }

    }, err => {
      this.isLoader = false;
      this.result = null;
    });
  }



  onFilterChange() {
    this.get();
  }

  onPageChange(page){
    this.page = page;
    this.get();
  }


}




