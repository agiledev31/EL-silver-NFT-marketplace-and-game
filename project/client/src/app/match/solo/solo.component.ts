import { Component, EventEmitter, OnInit, Output, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchMakingService, UserService } from 'src/app/core';
import { MatchFoundComponent } from 'src/app/shared/match-found/match-found.component';
import { MatchModalComponent } from 'src/app/shared/match-modal/match-modal.component';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-solo',
  templateUrl: './solo.component.html',
  styleUrls: ['./solo.component.css']
})
export class SoloComponent  {


  @ViewChild(MatchFoundComponent) matchFoundComponent!: MatchFoundComponent;
  @Output() timer = new EventEmitter<number>();

  public isUserCollapsed1= false;
  public isUserCollapsed2= false;

  currentUser:any = null;
  currentUserType2 = -1;
  currentUserType1 = -1;
  matchId: string = '';
  matchType = 0;
  isStartMatching = false;
  isStartMatchButtonDisable = true;

  soloRequest: any = null;

  timeLeft = 0;
  interval :any;
  constructor(private matchMakingService: MatchMakingService,private router: Router, private userService: UserService) {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
    });

    this.get();
  }
  get() {
    this.matchMakingService.getSoloMatch()
    .subscribe(res => {
      if(res.status === 200) {
        // exit lobby and delete this request
        this.soloRequest= res.data.soloRequest;
        if(this.soloRequest) {
            this.currentUserType2 = this.soloRequest.positions[0];
         this.currentUserType1 = this.soloRequest.positions[1];
         this.getRequestEvent();
        }

      }
    })
  }
  onClickStartMatching() {
    this.isStartMatchButtonDisable = true;
    this.matchMakingService.soloMatch({positions: [this.currentUserType2, this.currentUserType1]})
    .subscribe(res => {
      if(res.status === 200) {
        this.isStartMatching = true;
        this.getRequestEvent();
      Toast.fire({ icon: 'success', title: 'Solo Request Sent' })
      }
    })



  }
  onAcceptClick(event: number) {
    this.matchMakingService.acceptSoloMatch(this.matchId)
    .subscribe((res:any) => {
      if(res.status == 200)
      {
        this.router.navigate(['/match/', this.matchId])
      }
    })

  }

  getRequestEvent() {
    this.matchMakingService.getSoloEvent(this.currentUser._id).subscribe(res => {
      this.matchId = res.matchId;
      this.matchFoundComponent.openBox();
    })
  }


  onClickUserType1() {
    this.isUserCollapsed1 = !this.isUserCollapsed1;
  }
  onClickUserType2() {
    this.isUserCollapsed2 = !this.isUserCollapsed2;
  }
  onClickUser1(currentUserPlayerType: number) {
    this.currentUserType1 = currentUserPlayerType;
    this.isUserCollapsed1 = false;
    this.checkIsDisable()
  }
  onClickUser2(currentUserPlayerType: number) {
    this.currentUserType2 = currentUserPlayerType;
    this.isUserCollapsed2 = false;
    this.checkIsDisable()
  }
  checkIsDisable() {
    this.isStartMatchButtonDisable = this.currentUserType1 === -1 || this.currentUserType2 === -1;
  }


  OnDestroy() {
    // here delete the request if you are exiting
  }
}
