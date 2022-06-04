
import { Component, OnInit, ViewChild ,Input, Output, EventEmitter,} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { UserService } from './../../../core/services/user.service';
import { TournamentService } from './../../../core/services/tournament.service';
@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.css']
})
export class JoinComponent implements OnInit  {
  @Output() success = new EventEmitter<any>();
  @ViewChild('content') content: any;
  @Input() tournament:any = null;

  friends: any = null;
  selectedFriends: any = [];
  currentUser :any = null;
  teamName = '';
  isLoader = false;
  constructor(private modalService: NgbModal, private userService: UserService, private tournamentService: TournamentService) {
    this.userService.currentUser.subscribe(u => this.currentUser = u)
   }
   ngOnInit(): void {

     this.getFriends();
   }
  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });

  }
  close() {
    this.teamName = '';
    this.selectedFriends = [];
    this.modalService.dismissAll();
  }

  get startsIn() {
    var start = moment();
    var end   = moment(this.tournament?.startDate);
    return end.from(start);       // "in 5 days"

  }

  getFriends() {
    this.userService.myFriends().subscribe((res:any )=> {
      if(res.status === 200) {
        this.friends = res.data.result.docs;
      } else {
        this.friends = [];
      }

    }, err => {

      this.friends = [];
    })
  }
  onRemoveSelected(friend: any) {
    this.selectedFriends = this.selectedFriends.filter((e: any )=> e!== friend)
  }
  onTournamentSignUp() {
    this.isLoader = true;
    this.tournamentService.signUp(this.tournament._id, {teamName: this.teamName, invites :this.selectedFriends}).subscribe(res => {
      this.isLoader = false;
      if(res.status === 200) {
        this.success.emit()
      }
    }, err => {
      this.isLoader = false;
      alert('something went Wrong')

    })
  }
}
