import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { MatchFoundComponent } from 'src/app/shared/match-found/match-found.component';
import { MatchModalComponent } from 'src/app/shared/match-modal/match-modal.component';
import { Toast } from 'src/app/_constants/SwalToast';
import { MatchService,  UserService } from 'src/app/core';



@Component({
  selector: 'app-match-setup',
  templateUrl: './match-setup.component.html',
  styleUrls: ['./match-setup.component.css']
})
export class MatchSetupComponent {
  @ViewChild(MatchModalComponent) matchModalComponent!: MatchModalComponent;
  @ViewChild(MatchFoundComponent) matchFoundComponent!: MatchFoundComponent;
  @Output() timer = new EventEmitter<number>();

  public isUserCollapsed= false;
  public isUserCollapsed1= false;
  team :any[]= [];
  currentUser = null;
  currentUserType2 = -1;
  currentUserType1 = -1;
  matchType = 0;
  isStartMatching = false;
  isStartMatchButtonDisable = true;

  timeLeft = 0;
  interval :any;
  constructor(private matchService: MatchService, private router: Router, private userService: UserService) {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser) {
        this.createTeam();
      }
    });

    this.matchService.matchType.subscribe(matchType => {
      if(matchType != 0) {
        this.matchType = +matchType
      } else {
        this.router.navigate(['/mode']);
      }
    })
  }
  ngAfterViewInit() {
    if(this.matchType ==2){
      this.invite();
    }
  }
  onClickStartMatching() {
    this.isStartMatchButtonDisable = true;
    this.timeLeft = 60;
    this.timer.emit(this.timeLeft);
    this.interval = setInterval(() => {
          clearInterval(this.interval);
          this.matchFoundComponent.openBox();
      },1000);


  }
  onAcceptClick(event: number) {
    // send to back end for creating team
    let teamA = this.team.filter(e => e && ( e.player._id || e.player.username)).map(e => {return {player: {_id: e.player._id, username: e.player.username}, playerType: e.playerType}})
    this.matchService.createMatch(teamA, this.matchType)
    .subscribe((res:any) => {
      if(res.status == 200)
      {
        this.router.navigate(['/match/', res.data.matchId])
      }
    }, err=> {})
  }


  invite() {
    this.matchModalComponent.openLg()
  }
  onInviteUsers(team: any []) {
      this.createTeam(team);
      Toast.fire({ icon: 'success', title: 'Invitation Sent' })
  }
  createTeam(team: any [] = []) {
    this.team = [];
    this.team[2] = {player: this.currentUser, playerType: this.currentUserType1 };
    for (let i = 1; i < 5; i++) {
      if (i !== 2) {
        this.team[i] = team[i - 1] ? {player: team[i - 1], playerType: i } :  null;
      }
    }
  }
  onClickUserType1() {
    this.isUserCollapsed = !this.isUserCollapsed;
  }
  onClickUserType2() {
    this.isUserCollapsed1 = !this.isUserCollapsed1;
  }
  onClickUser(currentUserPlayerType: number) {
    this.isStartMatchButtonDisable = false;
    this.currentUserType1 = currentUserPlayerType;
    this.isUserCollapsed = false;
    this.team.forEach(e => {
      if(e && e.player === this.currentUser) {
        e.playerType = currentUserPlayerType;
      }
    })
  }
  onClickUser2(currentUserPlayerType: number) {
    this.currentUserType2 = currentUserPlayerType;
    this.isUserCollapsed1 = false;

  }


}
