import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TournamentService } from 'src/app/core';
import { ConfirmComponent } from '../confirm/confirm.component';
import { UserService } from './../../core/services/user.service';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css'],
})
export class InviteComponent {
  @ViewChild('content') content: any;
  @ViewChild(ConfirmComponent) confirmComponent!: ConfirmComponent;

  id: any = null;
  tournament: any = null;
  user: any = null;

  isLoader = false;
  currentUser : any = null;
  constructor(private modalService: NgbModal, private tournamentService: TournamentService,private userService:UserService) {
    this.userService.currentUser.subscribe(u => this.currentUser = u)
   }
  open() {
    this.modalService.open(this.content, { size: 'xl', centered: true });

  }
  close() {
    this.modalService.dismissAll();
  }
  getData() {
    this.isLoader = true;

    this.tournamentService.get(this.id).subscribe((res: any) => {
      this.isLoader = false;
      ;
      if (res.status == 200) {
        this.tournament = res.data.tournament;
        const isAlreadyPaid = this.isMeAlreadyPaid(this.tournament);
        if(isAlreadyPaid) {
          this.close();
          this.confirmComponent.silver = this.tournament.entryFee;
          this.confirmComponent.tournamentId = this.tournament._id;
          this.confirmComponent.status = 2;
          this.confirmComponent.open()
        } else {
          this.open();
        }
      }
    }, err => {
      this.isLoader = false;
      this.tournament = null;
      ;
    });

  }
  onPayClick() {
    this.close();
    this.confirmComponent.silver = this.tournament.entryFee;
    this.confirmComponent.tournamentId = this.tournament._id;
    this.confirmComponent.open()
  }

  isMeAlreadyPaid (tournament: any) : boolean {
    const team = this.myTeam(tournament);
    return team[0].players.filter((player: any) => player.user.toString() == this.currentUser._id.toString())[0].entryFeeStatus === 1 ? true : false;
  }
  myTeam(tournament: any) { return tournament.teams.filter((team: any) =>  team.players.some((player: any) => player.user.toString() == this.currentUser._id.toString()))}
}
