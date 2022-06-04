import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TournamentService } from 'src/app/core/services/tournament.service';

@Component({
  selector: 'app-tournament-search',
  templateUrl: './tournament-search.component.html',
  styleUrls: ['./tournament-search.component.css']
})
export class TournamentSearchComponent implements OnInit {

  page: number = 1;
  limit: number = 8;
  query = {
    searchQuery: null
  };

  result: any = null;
  isLoader: boolean = false;

  constructor(private tournamentService: TournamentService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params['search']) {
        this.query.searchQuery = params['search'];
        this.get();
      }
    });
  }


  get() {
    this.isLoader = true;
    this.tournamentService.getAllSearch(this.page, this.limit, this.query).subscribe((res: any) => {
      this.isLoader = false;
      ;

      if (res.status === 200) {
        if (this.result && this.result.docs.length > 0) {
          this.result.docs.push(...res.data.docs);
        } else {
          this.result = res.data;
        }
      }
    }, err => {
      this.isLoader = false;
      this.result = null;
    });
  }

  // changes Page
  pageChange() {
    this.page++;
    this.get();
  }

  detail(id: any) {
    this.router.navigate(['/mode/detail', id]);
  }

  goBack() {
    this.router.navigate(['/mode/tournament']);
  }

}
