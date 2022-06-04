import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/core/services/constant.service';
import { TournamentService } from 'src/app/core/services/tournament.service';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { LISTING_LIMIT } from 'src/app/_constants/ListingLimit';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  LIMITS = LISTING_LIMIT;
  result: any = null;

  page = 1;
  limit = 10;
  query = {
    status: -1,
    searchQuery: null,
  }

  isLoader = false;

  constructor(private tournamentService: TournamentService, private constService: ConstantService) { }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.isLoader = true;
    this.tournamentService.getAll(this.page, this.limit, this.query).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        this.result = res.status === 200 ? res.data : null;
      }
    }, err => {
      this.isLoader = false;
      this.result = null;
    });
  }


  get tournamentStatus() {
    return this.constService.tournamentStatus;
  }


  onFilterChange() {
    this.get();
  }

  onPageChange(page) {
    this.page = page;
    this.get();
  }

}
