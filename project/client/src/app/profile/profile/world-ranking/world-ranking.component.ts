import { Component, OnInit } from '@angular/core';
import {LolChallengeService} from "../../../core/services/lolchallenge.service";

@Component({
  selector: 'app-world-ranking',
  templateUrl: './world-ranking.component.html',
  styleUrls: ['./world-ranking.component.css']
})
export class WorldRankingComponent implements OnInit {
  leaderboardData: any[] = [];
  constructor(private lolChallengeService: LolChallengeService) { }

  ngOnInit(): void {
    this.getLeaderBoard();
  }
  getLeaderBoard(): void {
    this.lolChallengeService.getleaderboard().subscribe(leaderboard => {
      this.leaderboardData = leaderboard.data;
    });
  }
}
