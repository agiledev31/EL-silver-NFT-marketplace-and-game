import { Component, OnInit } from '@angular/core';
import { LolChallengeService } from '../../core/services/lolchallenge.service';

@Component({
  selector: 'app-lol-challenge',
  templateUrl: './lol-challenge.component.html',
  styleUrls: ['./lol-challenge.component.css'],
})
export class LolChallengeComponent implements OnInit {
  leaderBoardData: any=null;
  page=1;
  limit = 100;
  totalDocs:any;
  constructor(private lolChallangeService: LolChallengeService) { }

  ngOnInit(): void {
    this.lolChallangeService
      .getPagedleaderboard(this.page)
      .subscribe((leaderboardData) => {
        this.leaderBoardData = leaderboardData.data.result.docs;
        this.totalDocs = leaderboardData.data.totalDocs;
      });
  }

  // onLoadMore(): void {
  //   this.limit += 25;
  //   if (this.limit <= 100) {
  //     this.lolChallangeService
  //       .getleaderboard(1, this.limit)
  //       .subscribe((leaderboardData) => {
  //         console.log(leaderboardData);
  //         this.leaderBoardData = leaderboardData.data.result.docs;
  //       });
  //   }
  // }

  ongetMore(page:number): void {
      this.lolChallangeService
        .getPagedleaderboard(this.page)
        .subscribe((leaderboardData) => {
          console.log(leaderboardData);
          this.leaderBoardData = leaderboardData.data.result.docs;
          this.totalDocs = leaderboardData.data.totalDocs;
        });
  }


  onPageChange(event:any, page:number) {
    this.page = page;
    this.ongetMore(page);
  }

}
