import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatchService,  UserService } from 'src/app/core';

@Component({
  selector: 'app-match-modal',
  templateUrl: './match-modal.component.html',
  styleUrls: ['./match-modal.component.css']
})
export class MatchModalComponent implements OnInit {
  closeResult: string | undefined;
  @ViewChild('content') content: any;


  public isMenuCollapsed = true;
  public isMenuCollapsed1 = false;

  friends :any;
  users : any;
  selectedUsers :any[] = [];
  map = -1;
  position = -1;
  @Output() createLobby= new EventEmitter<any>();
  @Output() inviteUsers= new EventEmitter<any>();

  modalType = 1;
  constructor( private modalService: NgbModal,private matchService: MatchService) {}

  ngOnInit(): void {
    this.getFriendsAndRecentlyPlayedWith();
  }
  onFriendSelect(i :number ){
    this.friends[i].isSelected = !this.friends[i].isSelected
    if(this.friends[i].isSelected){
      this.selectedUsers.push(this.friends[i]);
    } else {
      this.selectedUsers = this.selectedUsers.filter(e => e !== this.friends[i]);
    }
  }
  onUserSelect(i :number ){
    this.users[i].isSelected = !this.users[i].isSelected
    if(this.users[i].isSelected){
      this.selectedUsers.push(this.users[i]);
    } else {
      this.selectedUsers = this.selectedUsers.filter(e => e !== this.users[i]);
    }
  }
  getFriendsAndRecentlyPlayedWith() {
    this.matchService.getFriendsAndRecentlyPlayedWith().subscribe((res: any ) => {
      if(res.status == 200){
        this.friends = (res.data.friends as any[]).map(e => {return {isSelected: false, ...e}});
        this.users = (res.data.users as any[]).map(e => {return {isSelected: false, ...e}});
      }
    }, err=> {})
  }
  onMapChange(map: number) { this.map = map; }
  onChangePosition(position: number) { this.position = position;}
  openLg() {
    this.modalService.open(this.content, { size: 'md' ,  backdrop: 'static'});
  }
  close() {
    this.modalService.dismissAll()
  }
  closeTeam()
  {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  closeTeam1()
  {
    this.isMenuCollapsed1 = !this.isMenuCollapsed1;
  }
  invite() {
    if(this.modalType === 1) {
      this.createLobby.emit({users: this.selectedUsers, position: this.position, map : this.map});
      this.modalType = 2;
    } else {
      this.inviteUsers.emit({users: this.selectedUsers});
    }
    this.close();
  }
}
