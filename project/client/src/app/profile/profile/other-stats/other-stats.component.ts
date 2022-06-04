import { Component, OnInit } from '@angular/core';
import { LolChallengeService } from '../../../core/services/lolchallenge.service';
import * as moment from 'moment';
@Component({
  selector: 'app-other-stats',
  templateUrl: './other-stats.component.html',
  styleUrls: ['./other-stats.component.css'],
})
export class OtherStatsComponent implements OnInit {
  totalLaplataEarned: any;
  withdrwan: any;
  availableForWithdrawal: any;
  averageLastWeek: any;
  averagePerday: any;
  earnedLastMonth: any;
  lastMonthName = moment().startOf("month").format('MMMM');
  constructor(private lolChallengeService: LolChallengeService) {}

  ngOnInit(): void {
    this.getStatistics();
  }
  getStatistics(): void {
    this.lolChallengeService.getStatistics().subscribe((res: any) => {
      this.totalLaplataEarned = res.data.totalLaplataEarned;
      this.withdrwan = res.data.withdrwan;
      this.availableForWithdrawal = res.data.availableForWithdrawal;
      this.averageLastWeek = res.data.averageLastWeek;
      this.averagePerday = res.data.averagePerday;
      this.earnedLastMonth = res.data.earnedLastMonth;
    });
  }
}
