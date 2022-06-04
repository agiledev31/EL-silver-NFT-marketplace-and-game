import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService,  UserService } from 'src/app/core';

import { MatchPlayer } from 'src/app/models/MatchPlayer';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-recent',
  templateUrl: './recent.component.html',
  styleUrls: ['./recent.component.css']
})
export class RecentComponent implements OnInit {
  public isMenuCollapsed = false;
  public isMenuCollapsed1 = false;
  isLoader: boolean = false;

  result: any = null;
  page = 1;
  limit = 10;

  currentID = null;

  // Search Query and Filters
  query = {
    type: 0
  };





  constructor(private matchService: MatchService, private router: Router) { }

  ngOnInit(): void {
    this.myMatches();
  }

  myMatches() {
    this.isLoader = true;
    this.result = null;
    this.matchService.my(this.page, this.limit, this.query).subscribe((res: any) => {
      // ;
      this.isLoader = false;
      if (res.status === 200) {
        this.result = res.data.result;
        this.currentID = res.data._id;
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
  isWinner(winnerTeam: MatchPlayer[]): boolean {
    for (let i = 0; i < winnerTeam.length; i++) {
      if (winnerTeam[i].player === this.currentID) {
        return true;
      }
    }
    return false;
  }

  getPosition(teamA: MatchPlayer[], teamB: MatchPlayer[]) {
    for (let i = 0; i < teamA.length; i++) {
      if (teamA[i].player === this.currentID) {
        return teamA[i].playerType;
      }
    }
    for (let i = 0; i < teamB.length; i++) {
      if (teamB[i].player === this.currentID) {
        return teamB[i].playerType;
      }
    }
    return 0;
  }


  clickStartPlaying() {
    this.router.navigate(['/mode']);
  }

  changeType(value: number) {
    this.query.type = value;
    this.myMatches();
  }


  pageChange(page: number) {
    this.page = page;
    this.myMatches();
  }
  closeTeam()
  {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  closeTeam1()
  {
    this.isMenuCollapsed1 = !this.isMenuCollapsed1;
  }
}
