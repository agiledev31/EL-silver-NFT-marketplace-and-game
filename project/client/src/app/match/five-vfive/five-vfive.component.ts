import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatchMakingService, UserService } from 'src/app/core';

import { MatchFoundComponent } from 'src/app/shared/match-found/match-found.component';
import { MatchModalComponent } from 'src/app/shared/match-modal/match-modal.component';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-five-vfive',
  templateUrl: './five-vfive.component.html',
  styleUrls: ['./five-vfive.component.css']
})
export class FiveVFiveComponent {

  @ViewChild(MatchModalComponent) matchModalComponent!: MatchModalComponent;
  @ViewChild(MatchFoundComponent) matchFoundComponent!: MatchFoundComponent;
  @Output() timer = new EventEmitter<number>();

  public isUserCollapsed= false;
  public isUserCollapsed1= false;
  currentUser: any = null;

  fiveRequest : any =null;
  team :any[]= [];

  currentUserType = -1;

  isStartMatching = false;
  isStartMatchButtonDisable = true;

  timeLeft = 0;
  interval :any;

  id: any = null;
  constructor(private matchingService: MatchMakingService, private route: ActivatedRoute,  private router: Router, private userService: UserService) {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user;
      if(this.currentUser) {
        this.createTeam();
      }
    });
    this.route.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log('params', params)
      if(this.id) {
        this.get();
      }
   });

  }
  ngAfterViewInit() {
    console.log('this.id', this.id)
    if(!this.id) {
      this.matchModalComponent.openLg()
    }

  }
  get() {
    this.matchingService.get5v5Lobby(this.id).subscribe((res: any)=> {
      this.fiveRequest = res.data.match;
      this.createTeam();
    })
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

  }


  invite() {
    this.matchModalComponent.modalType= 2;
    this.matchModalComponent.openLg()
  }
  onInviteUsers(invite: any ) {
    this.currentUserType = invite.position;
    this.matchingService.invite5v5(this.fiveRequest._id, { invites: invite.users}).subscribe((res: any) => {
      if(res.status === 200) {
        this.fiveRequest = res.data.match;
        this.createTeam();
      Toast.fire({ icon: 'success', title: 'Invitation Sent' })
      }
    })

  }
  onCreateLobby(lobby: any ) {
    this.currentUserType = lobby.position;
    this.matchingService.create5v5Lobby({currentUserType: this.currentUserType, invites: lobby.users, map: lobby.map}).subscribe((res: any) => {
      if(res.status === 200) {
        this.fiveRequest = res.data.match;
        this.createTeam();
        Toast.fire({ icon: 'success', title: 'Lobby Created' })
      }
    })

  }
  createTeam() {
    if(this.fiveRequest) {
      this.team = this.fiveRequest.team;
      for (let index = this.fiveRequest.team.length; index < 5; index++) {
        this.team.push(null);
      }
    } else {
      this.team = [{player: this.currentUser ,playerType: this.currentUserType }, null,null,null,null,];
    }
  }
  onClickUserType1() {
    this.isUserCollapsed = !this.isUserCollapsed;
  }

  onClickUser(currentUserPlayerType: number) {
    this.isStartMatchButtonDisable = false;
    this.currentUserType = currentUserPlayerType;
  //   this.team = this.team.map(e => {
  //      if(e.player._id === this.currentUser._id) {
  //         e.playerType= this.currentUserType;
  //       }
  //     return e;
  //  });
    this.isUserCollapsed = false;

  }



}
