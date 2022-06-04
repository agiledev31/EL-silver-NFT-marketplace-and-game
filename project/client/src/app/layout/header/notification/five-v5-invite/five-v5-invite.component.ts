import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchMakingService, MatchService, UserService } from 'src/app/core';

import { ConfirmComponent } from 'src/app/shared/confirm/confirm.component';

@Component({
  selector: 'app-five-v5-invite',
  templateUrl: './five-v5-invite.component.html',
  styleUrls: ['./five-v5-invite.component.css'],
})
export class FiveV5InviteComponent {
  @ViewChild('content') content: any;
  @ViewChild(ConfirmComponent) confirmComponent!: ConfirmComponent;

  id: any = null;
  fiveV5Request: any = null;
  user: any = null;

  isLoader = false;
  currentUser: any = null;
  constructor(
    private modalService: NgbModal,
    private matchMakingService: MatchMakingService,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.currentUser.subscribe((u) => (this.currentUser = u));
  }
  open() {
    this.modalService.open(this.content, { size: 'xl', centered: true });
  }
  close() {
    this.modalService.dismissAll();
  }
  getData() {
    this.isLoader = true;
    this.matchMakingService.get5v5Lobby(this.id).subscribe(
      (res) => {
        if (res.status === 200) {
          this.fiveV5Request = res.data.match;
        } else {
          this.fiveV5Request = null;
        }
        this.isLoader = false;
      },
      (err) => {
        this.isLoader = false;
        this.fiveV5Request = null;
      }
    );
  }

  get isTeamFull() {
    return (
      !this.isMeInTeam &&
      this.fiveV5Request &&
      this.fiveV5Request.team.length >= 5
    );
  }
  get isMeInTeam() {
    return this.fiveV5Request &&
    this.fiveV5Request.team.findIndex((player : any)=> player.player.toString() === this.currentUser._id.toString()) !== -1;
  }
  onLobbyClick() {
    this.matchMakingService.accept5v5Lobby(this.id).subscribe(
      (res) => {
        if (res.status === 200) {
          this.fiveV5Request = res.data.match;
          this.router.navigate(['/match/setup/lobby',this.fiveV5Request._id]);
          this.close();
        } else {
          this.fiveV5Request = null;
        }
        this.isLoader = false;
      },
      (err) => {
        this.isLoader = false;
        this.fiveV5Request = null;
      }
    );

  }
}
