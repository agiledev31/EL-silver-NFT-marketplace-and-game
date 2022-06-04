import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatchService,  UserService } from 'src/app/core';


@Component({
  selector: 'app-setup-layout',
  templateUrl: './setup-layout.component.html',
  styleUrls: ['./setup-layout.component.css']
})
export class SetupLayoutComponent implements OnInit, OnDestroy {
  public isCollapsed = false;
  public isMenuCollapsed = false;
  userMatchService: Subscription = new Subscription();
  matchType = 0
  timeLeft = 0;
    currentUser : any = null;
  constructor(private matchService: MatchService,private userService: UserService , private router: Router) {
        this.userService.currentUser.subscribe(u => this.currentUser = u);
    this.userMatchService = this.matchService.matchType.subscribe(matchType => {
      if(matchType != 0) {
        this.matchType = +matchType
      } else {
        this.router.navigate(['/mode']);
      }
    })
  }

  ngOnInit(): void {
  }
  onChatFocus() {
    this.isCollapsed = true;
    this.isMenuCollapsed = true;
  }
  ngOnDestroy() {
    this.userMatchService.unsubscribe();
  }
  onTimer(time:number) {
    this.timeLeft= time;
  }

}
