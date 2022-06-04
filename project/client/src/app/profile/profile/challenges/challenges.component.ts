import { Component, OnInit } from '@angular/core';
import { LolChallengeService } from "../../../core/services/lolchallenge.service";
import * as _ from 'lodash';
import * as moment from "moment";
import {UserService} from "../../../core";

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css']
})
export class ChallengesComponent implements OnInit {
  challengesPlayed: any;
  totalGamesPlayed: any;
  totalLaplataEarned: any;
  history: any[] = [];
  totalDocs: any;
  rank: any;
  constructor(private lolChallengeService: LolChallengeService, private userService: UserService) { }

  ngOnInit(): void {
    this.getStatistics();
    this.fetchChallengeHistory();
    this.getUserRank();
  }
  public fetchChallengeHistory(): void {
    this.lolChallengeService.fetchChallengeHistory({page: '1', limit: '2'}).subscribe(data => {
      if (!_.isEmpty(data.data.result)) {
        this.history = data.data.result.docs;
        this.totalDocs = data.data.result.totalDocs;
      }
    });
  }
  getStatistics(): void {
    this.lolChallengeService.getStatistics().subscribe( (res: any) => {
      this.challengesPlayed = res.data.challengesPlayed;
      this.totalGamesPlayed = res.data.gamesPlayed;
      this.totalLaplataEarned = res.data.totalLaplataEarned;
    });
  }
  avgGameLength(x: any) {
    const endTime = moment(x.updatedAt).valueOf()
    const startTime = moment(x.gameStatistics.startTime).valueOf();
    // const diff = moment(endTime).diff(startTime, 'minutes');
    const diff = moment(endTime).diff(startTime, 'minutes') == 0 ? moment(endTime).diff(startTime, 'seconds') + " secs" : moment(endTime).diff(startTime, 'minutes') + " mins";
    return diff;
  }
  formatTime(time: any) {
    return this.time_ago(new Date(time));
  }
  time_ago(time: any): any {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) time = time.getTime();
        break;
      default:
        time = +new Date();
    }
    var time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    var seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now'
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    var i = 0,
      format;
    while (format = time_formats[i++])
      if (seconds < format[0]) {
        if (typeof format[2] == 'string')
          return format[list_choice];
        else
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
      }
    return time;
  }
  getUserRank(): void {
    this.userService.getUserRank().subscribe(rankData =>{
      this.rank = rankData.data.rank;
    });
  }
}
