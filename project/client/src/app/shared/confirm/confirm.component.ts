import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core';
import { TournamentService } from 'src/app/core/services/tournament.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  @ViewChild('content') content: any;
  currentUser : any = null;
  silver  = 0;
  status = 1; // 1 for unpaid , 2 for paid
  isLoader = false;
  tournamentId : any = null;

  error: any = null;
  constructor(private modalService: NgbModal, private userService: UserService, private router: Router , private tournamentService: TournamentService) {
    this.userService.currentUser.subscribe(u => this.currentUser = u)
  }
  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });

  }
  close() {
    this.modalService.dismissAll();
    this.silver  = 0;
  this.status = 1; // 1 for unpaid , 2 for paid
  this.isLoader = false;
  this.tournamentId = null;

  this.error= null;
  }
  onConfirmClick() {
    this.isLoader = true;
    this.tournamentService.confirmInvitePayment(this.tournamentId)
    .subscribe((response: any) => {
      if(response.status === 200) {
        this.isLoader = false;
        this.status = 2;
      } else {
        this.error = 'Something went wrong! please try again';
      }
    }, err => this.error = 'Something went wrong! please try again')

  }

  onTournamentClick() {
    let url = '';
    if(this.tournamentId) {
      url = `/mode/detail/${this.tournamentId}`
    } else {
      url = '/mode/tournament'
    }
    this.close();
    this.router.navigate([url]);
  }

}
