import { Component, OnInit, ViewChild } from '@angular/core';
import { MatchService,  UserService } from 'src/app/core';

import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Match } from 'src/app/models/Match';
import { Toast } from 'src/app/_constants/SwalToast';
import { MatchResultsComponent } from 'src/app/shared/match-results/match-results.component';

@Component({
  selector: 'app-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {

  isLoader: boolean = false;

  matchID: any | null;
  match: any | null;

  isRoomReady: boolean = false;

  isEndGame: boolean = false;
  winner: number = 0;

  isMatchStarted: boolean = false;


  matchType = 0;
  step = 1;
  timer = 20;
  intervalId: any;
  playTime = 0;
  playTimeIntervalId: any;

  @ViewChild(MatchResultsComponent) matchResultsComponent!: MatchResultsComponent;
  constructor(private matchService: MatchService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    // if (this.matchService.matchType.value != 0) {

      this.matchType = this.matchService.matchType.value;
      console.log('this.matchType', this.matchType)
    // } else {
    //   this.router.navigate(['/mode']);
    // }

    this.route.params.subscribe(params => {
      this.matchID = params['id'];
      if (this.matchID) {
        this.getMatch();
      }
    });
  }


  getMatch() {
    this.isLoader = true;
    this.matchService.getMatchDetails(this.matchID).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        // ;
        this.match = res.data.match;
      }
      else {
        ;
        // Toast.fire({ icon: 'error', title: 'Something went wrong' })
      }
    }, err => {
      ;
      // Toast.fire({ icon: 'error', title: 'Server Error' })
    })

  }

  exit() {
    this.matchService.exit();
    this.router.navigate(['/mode']);
  }

  changeWinnerTeam(value: number) {
    this.winner = value;
  }


  submitWinner() {
    this.matchService.exit();

    this.matchService.update(this.matchID, { winnerTeam: this.winner }).subscribe((res: any) => {
      if (res.status == 200) {
        Toast.fire({ icon: 'success', title: 'Match Result Saved' });
        this.matchResultsComponent.type = this.winner;
        this.matchResultsComponent.openLg();
      } else {
        ;
        // Toast.fire({ icon: 'error', title: 'Something went wrong' })
      }
    }, err => {
      ;
      // Toast.fire({ icon: 'error', title: 'Server Error' })
    })

  }

  stepChange(step: number) {
    this.step = step;
    if (this.step == 2) {
      this.startTimer();

    }

  }
  startTimer() {


    const getProgress = () => {

      if (this.timer > 0) {
        this.timer = this.timer - 1;
      }
      else {
        this.step++;
        // this.playTimer();
        clearInterval(this.intervalId);
      }
    }
    this.intervalId = setInterval(getProgress, 1000);
  }
  playTimer() {
    const getProgress = () => {

      if (this.playTime >= 0) {
        this.playTime = this.playTime + 1;
      }
      else {
        clearInterval(this.playTimeIntervalId);
      }
    }
    this.playTimeIntervalId = setInterval(getProgress, 1000);
  }
  goToHome() {
    this.router.navigate(['/']);
  }
  goToMode() {
    this.router.navigate(['/mode']);
  }
  ngOnDestroy() {
    clearInterval(this.intervalId);
    clearInterval(this.playTimeIntervalId);
  }
}
