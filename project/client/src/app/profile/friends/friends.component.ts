import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = false;
  public isMenuCollapsed1 = false;
  result: any = null;
  page = 1;
  limit = 9;

  isLoader: boolean = false;


  // Search Query and Filters
  query = {};

  suggestedFriends: any[] = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.getSuggestedFriends();
    this.getMyFriends();
  }

  getSuggestedFriends() {
    this.isLoader = true;

    this.userService.getUsersToAddFriend().subscribe((res: any) => {
      this.isLoader = false;
      if (res.status == 200) {
        this.suggestedFriends = res.data.users;
      } else {
        ;
        // Toast.fire({ icon: 'error', title: 'Something went wrong' })
      }
    }, err => {
      ;
      // Toast.fire({ icon: 'error', title: 'Server Error' })
    })

  }

  addFriend(u: any) {
    this.isLoader = true;
    this.userService.update({ friend: u._id }).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status == 200) {
        Toast.fire({ icon: 'success', title: 'Friend Added' })
        this.result.docs.push(u); //adds to Docs
        this.result.totalDocs++;
        this.getSuggestedFriends();
        // this.getMyFriends();
      } else {
        ;
      }
    }, err => {
      ;
    })
  }

  getMyFriends() {
    this.isLoader = true;
    this.userService.myFriends(this.page, this.limit, this.query).subscribe((res: any) => {
      this.isLoader = false;
      if (res.status === 200) {
        if (this.result && this.result.docs.length > 0) {
          this.result.docs.push(...res.data.result.docs);
        } else {
          this.result = res.data.result;
        }
      } else {
        ;
      }
    }, err => {
      ;
    })

  }

  // changes Page
  pageChange() {
    this.page++;
    this.getMyFriends();
  }


  ngOnDestroy(): void {
  }


  closeTeam()
  {
    this.isMenuCollapsed = !this.isMenuCollapsed;
  }
  closeTeam1()
  {
    this.isMenuCollapsed1 = !this.isMenuCollapsed1;
  }

}
