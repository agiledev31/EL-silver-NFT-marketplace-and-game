import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/core/services/constant.service';
import { LISTING_LIMIT } from 'src/app/_constants/ListingLimit';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  LIMITS = LISTING_LIMIT;
  result: any = null;
  page = 1;
  limit = 10;
  query = {
    status: -1,
    searchQuery: null,
  }

  isLoader = false;

  searchQuery : string ='';
  constructor( private constService: ConstantService) { }

  ngOnInit(): void {
  }
  searchPage(){

  }
  get tournamentStatus() {
    return this.constService.tournamentStatus;
  }
  onFilterChange(){

  }
  editDailyLaplata(){
    
  }
}
