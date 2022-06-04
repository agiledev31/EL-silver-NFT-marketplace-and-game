import { Component, OnInit, Input } from '@angular/core';
import { LolChallengeService } from '../../core/services/lolchallenge.service';

@Component({
  selector: 'app-challengeleaderboard',
  templateUrl: './challengeleaderboard.component.html',
  styleUrls: ['./challengeleaderboard.component.css']
})
export class ChallengeleaderboardComponent implements OnInit {

  @Input() data: any;
  leaderBoardData: any = null;
  page = 1;
  limit = 100;
  totalDocs: any;
  constructor(private lolChallangeService: LolChallengeService) { }

  ngOnInit(): void {
    console.log('ksms',this.data)
    this.lolChallangeService
      .getMiningChallengeLeaderboard(this.page, this.data)
      .subscribe((leaderboardData) => {
        console.log(leaderboardData);
        this.leaderBoardData = leaderboardData.data.result.docs;
        this.totalDocs = leaderboardData.data.totalDocs;
      });
  }

  ongetMore(page: number): void {
    this.lolChallangeService
      .getMiningChallengeLeaderboard(this.page, this.data)
      .subscribe((leaderboardData) => {
        console.log(leaderboardData);
        this.leaderBoardData = leaderboardData.data.result.docs;
        this.totalDocs = leaderboardData.data.totalDocs;
      });
  }

  onPageChange(event: any, page: number) {
    this.page = page;
    this.ongetMore(page);
  }

  myfun(rank:number)
  {
    let array= this.data.prizedistribution;

    for(let x of array)
    {
      if(x[0]<=rank && rank<=x[1])
      {
      return x[2];
      }
    }
  }


}
