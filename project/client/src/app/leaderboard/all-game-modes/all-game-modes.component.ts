import { Component, Input, OnInit } from '@angular/core';
import { LolChallengeService } from '../../core/services/lolchallenge.service';

@Component({
  selector: 'app-all-game-modes',
  templateUrl: './all-game-modes.component.html',
  styleUrls: ['./all-game-modes.component.css'],
})
export class AllGameModesComponent implements OnInit {
  leaderBoardData: any[] = [];
  limit = 20;
  winWidth = 0;

  constructor(private lolChallangeService: LolChallengeService) {}

  compareObjects(object1: any, object2: any, key: any) {
    const obj1 = object1[key].toUpperCase();
    const obj2 = object2[key].toUpperCase();
    if (obj1 < obj2) {
      return -1;
    }
    if (obj1 > obj2) {
      return 1;
    }
    return 0;
  }

  ngOnInit(): void {
    this.lolChallangeService
      .getleaderboard(1, 10)
      .subscribe((leaderboardData) => {
        this.leaderBoardData = leaderboardData.data.result.docs;
      });
  }

  onLoadMore(): void {
    this.limit += 10;
    if (this.limit <= 100) {
      this.lolChallangeService
        .getleaderboard(1, this.limit)
        .subscribe((leaderboardData) => {
          this.leaderBoardData = leaderboardData.data.result.docs;
        });
    }
  }
}
