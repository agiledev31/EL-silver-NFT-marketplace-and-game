import { Component, Input, OnInit, Output,  EventEmitter  } from '@angular/core';
import { ChatService } from '../chat.service';
import { ActivatedRoute, Router, } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {
  selectedUserId = null;
  @Output() isNoFriends = new EventEmitter<boolean>();
  friends : any[]= [];
  isLoading = false;
  constructor(private chatService: ChatService, private route: ActivatedRoute, private router: Router) {
   }

  ngOnInit(): void {
    this.isLoading = true;
    this.getFriends();
  }
  getFriends(){
    this.chatService.getChatUsers().subscribe((res) => {
      if(res.status === 200) {
        this.friends = res.data.userList;
        if(this.friends.length === 0) {
          this.isNoFriends.emit(true);
        }
        if(this.friends.length > 0 && (!this.selectedUserId)) {
          this.router.navigate(['/chat', this.friends[0]._id])
          this.selectedUserId = this.friends[0]._id;
        }
      } else {
        this.friends = [];
      }
      this.isLoading = false;

    }, err => {
      this.friends = [];
      this.isNoFriends.emit(true);
      this.isLoading = false;

    })
  }
  onFriendClick(user:any) {
    this.selectedUserId = user._id;
    this.router.navigate(['/chat',user._id]);
  }
   ngOnDestroy() {
  }
}
