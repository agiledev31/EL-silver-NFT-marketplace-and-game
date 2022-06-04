import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Slick } from 'ngx-slickjs';
import { TournamentService } from 'src/app/core/services/tournament.service';

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.css']
})
export class TournamentComponent implements OnInit {
  config: Slick.Config = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    variableWidth: true,
    autoplaySpeed: 10000
  }
  config1: Slick.Config = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    variableWidth: false,
    autoplaySpeed: 10000
  }

  ongoing: any = null;
  upcoming: any = null;
  past: any = null;

  page = 1;
  limit = 8;
  query = {};

  searchQuery: any = null;

  isLoader = false;
  constructor(private tournamentService: TournamentService, private router: Router) { }

  ngOnInit(): void {
    this.get();
  }

  get() {
    this.isLoader = true;
    this.tournamentService.getAll(this.page, this.limit, this.query).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        if (this.upcoming && this.upcoming.docs.length > 0) {
          this.upcoming.docs.push(...res.data.upcoming.docs);
        } else {
          this.upcoming = res.data.upcoming;
        }
        this.ongoing = res.data.ongoing.docs;
        // this.upcoming = res.data.upcoming;
        this.past = res.data.past.docs;
        // ;
      }
    }, err => {
      this.isLoader = false;
      this.ongoing = null;
      this.upcoming = null;
      this.past = null;
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

  searchPage() {
    if (this.searchQuery) {
      this.router.navigate(['/mode/tournament/', this.searchQuery]);
    }
    return;
  }



}
