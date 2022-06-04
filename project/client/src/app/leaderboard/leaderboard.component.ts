import { Component, OnInit } from '@angular/core';
import {NgbNavConfig} from '@ng-bootstrap/ng-bootstrap';
import {LolChallengeService} from '../core/services/lolchallenge.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  providers: [NgbNavConfig]
})
export class LeaderboardComponent implements OnInit {
  leaderboardData: any[] | undefined;
  constructor(config: NgbNavConfig, private lolChallangeService: LolChallengeService) {
    config.destroyOnHide = false;
    config.roles = false;
  }

  ngOnInit(): void {
     this.lolChallangeService.getleaderboard(1, 100).subscribe(leaderboardData => {
       this.leaderboardData = leaderboardData.data.result.docs;
    });
  }

}
