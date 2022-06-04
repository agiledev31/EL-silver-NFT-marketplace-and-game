import { Component, OnInit } from '@angular/core';
import { ConstantService } from 'src/app/core/services/constant.service';
import { LolChallengeService } from 'src/app/core/services/lolchallenge.service';
import { LISTING_LIMIT } from 'src/app/_constants/ListingLimit';
import * as _ from "lodash";
import * as moment from 'moment';

@Component({
  selector: 'app-lolchallenge',
  templateUrl: './lolchallenge.component.html',
  styleUrls: ['./lolchallenge.component.css']
})

export class LolChallengeComponent implements OnInit {
  LIMITS = LISTING_LIMIT;
  result: any = null;
  page = 1;
  limit = 10;
  query = {
    status: -1,
    searchQuery: null,
    sortstatus:-1,
  };
  statuses = [{ id: -1, name: 'Today' }, { id: 1, name: 'This Week' }, { id: 2, name: 'This Month' }, { id: 3, name: 'All Time' }];
  sortstatus = [{ id: -1, name: 'Default' }, { id: 1, name: 'Ascending' },];

  userId;
  isChallengeHistoryVisible = false;

  isLoader = false;
  searchQuery: string = '';
  searchText;
  laplataSettings: any = {};
  perDayDistributionInput: string;
  hardCapInput: string;
  incentiveInput: string;
  minwithdrawInput: string;

  challenges: any = {};
  statistics = {
    totalChallenges: 0,
    totalGamesPlayed: 0,
    totalDailyChallenges: 0,
    totalDailyGamesPlayed: 0,
    releasedLaplata: 0,
    ongoingChallenges: 0,
  };
  constructor(private constService: ConstantService, private lolChallengeService: LolChallengeService) { }

  ngOnInit(): void {
    this.getLaplataSettings();
    this.getAllChallenges(this.page,this.query);
  }

  get tournamentStatus() {
    return this.constService.tournamentStatus;
  }

  onFilterChange() {
    //alert("Query to do");
    this.page=1;
    this.getAllChallenges(1,this.query)
    console.log(this.query.status, this.query.sortstatus);
  }

  async editDailyLaplata() {
    console.log("In api service getlaplata", this.laplataSettings);
    this.lolChallengeService.updateLaplataSettings(this.perDayDistributionInput, this.laplataSettings.hardCap, this.laplataSettings.incentive, this.laplataSettings.minwithdrawal)
      .subscribe(response => {
        this.laplataSettings = _.get(response, "data.settings");
      });
  }

  getLaplataSettings() {
    this.lolChallengeService.getLaplataSettings()
      .subscribe(response => {
        this.laplataSettings = _.get(response, "data.settings");
        console.log("In api service getlaplata", this.laplataSettings);
      });
  }

  editHardCap() {
    this.lolChallengeService.updateLaplataSettings(this.laplataSettings.perDayDistribution, this.hardCapInput, this.laplataSettings.incentive, this.laplataSettings.minwithdrawal)
      .subscribe(respone => {
        this.laplataSettings = _.get(respone, "data.settings");
      });
  }

  editIncentive() {
    this.lolChallengeService.updateLaplataSettings(this.laplataSettings.perDayDistribution, this.laplataSettings.hardCap, this.incentiveInput, this.laplataSettings.minwithdrawal)
      .subscribe(respone => {
        this.laplataSettings = _.get(respone, "data.settings");
      });
  }

  editWithdraw() {
    this.lolChallengeService.updateLaplataSettings(this.laplataSettings.perDayDistribution, this.laplataSettings.hardCap, this.incentiveInput, this.minwithdrawInput)
      .subscribe(respone => {
        this.laplataSettings = _.get(respone, "data.settings");
      });
  }

  getAllChallenges(page?: any,query?: any) {
    console.log(query);

    this.lolChallengeService.getAllChallenges({ page: page,sortstatus: query.sortstatus, time:query.status })
      .subscribe(response => {
        console.log("response of getallchallenge",response.data)
        if(page==1){
        this.statistics = _.get(response, "data.statistics");
      }
        console.log("In api service => Statistics", this.statistics);
        this.challenges = _.get(response, "data.result");
        //console.log("In api service => Challenges", this.challenges);

        for (let x of this.challenges.docs) {
          const endTime = moment(x.gameStatistics.endTime).valueOf()
          const startTime = moment(x.gameStatistics.startTime).valueOf();

          const now = moment().valueOf();

          if(x.isFinished)
          {
            const diff = moment(endTime).diff(startTime, 'minutes') == 0 ? moment(endTime).diff(startTime, 'seconds') + " secs" : moment(endTime).diff(startTime, 'minutes') + " mins";
            x.Duration = diff;
          }
          else
          {
            if(endTime<now)
            {
              x.Duration="overtime"
            }
            else{
              const diff = moment(now).diff(startTime, 'minutes') == 0 ? moment(now).diff(startTime, 'seconds') + " secs" : moment(now).diff(startTime, 'minutes') + " mins";
              x.Duration = diff;
            }

          }

        }
      });
  }

  formatTime(time: any) {
    return moment(time).fromNow();
  }

  viewChallengeHistory(userId) {
    this.userId = userId;
    this.isChallengeHistoryVisible = true;
  }

  searchKeyPress(event) {
    if (event.target.value === "") {
      this.getAllChallenges(this.page, this.query);
    }
    else{
      this.search(this.page)
    }
  }

  search(page?: any) {
    if(this.searchText!=""){
    this.lolChallengeService.search(this.searchText, { page: page }).subscribe((res: any) => {
      this.challenges = res.data;
    });
  }
  }

  onPageChange(x,page) {
    this.page = page;
    this.getAllChallenges(page,this.query);
  }
}
