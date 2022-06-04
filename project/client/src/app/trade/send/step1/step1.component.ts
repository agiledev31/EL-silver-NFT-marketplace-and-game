import { Component, OnInit } from '@angular/core';
import { TradeService, UserService } from 'src/app/core';
import { SendService } from '../send.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {

  isLoader = false;

  friends: any = null;
  query = '';
  friendsFromService = [];
  constructor(private userService: UserService, private router: Router, private sendService: SendService) { }

  ngOnInit(): void {
    this.sendService.friends.subscribe((friends) => {
      if (friends) {
        this.friendsFromService = friends;
      } else {
        this.friendsFromService = [];
      }
    });
    this.getFriends();
  }
  getFriends() {
    this.isLoader = true;

    this.userService.myFriends().subscribe((res:any )=> {
      if(res.status === 200) {
        this.friends = res.data.result.docs.map( (e:any ) => { return {isSelected: this.friendsFromService.findIndex((f:any)=> f._id === e._id) !== -1, ...e} });
      } else {
        this.friends = [];
      }
      this.isLoader = false;
    }, err => {
      this.isLoader = false;
      this.friends = [];
    })
  }

  get filteredFriends() {
    return this.friends ? this.friends.filter((e:any) => {
      if((e.fullName as String).toLocaleLowerCase().includes(this.query.toLocaleLowerCase()) ||
      (e.username as String).toLocaleLowerCase().includes(this.query.toLocaleLowerCase()) ||
      (e.email as String).toLocaleLowerCase().includes(this.query.toLocaleLowerCase())
      ) {
        return e;
      }
    }) : [];
  }
  get selectedFriends() {return this.friends ? this.friends.filter((e:any) => e.isSelected): []}

  onFriendSelect(friend: any) {
    this.friends[this.friends.findIndex((el :any)=> el._id === friend._id)].isSelected = !friend.isSelected;
  }
  onNextClick() {
    if(this.selectedFriends.length === 0) {return ;}
    this.sendService.friendsSubject.next(this.selectedFriends);
    this.router.navigate(['/trade/send/2']);
  }
}
