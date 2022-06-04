import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/core';
import { Subscription } from 'rxjs';
import { Toast } from 'src/app/_constants/SwalToast';
import {  Input, Output, EventEmitter} from '@angular/core';
import {LolChallengeService} from 'src/app/core/services/lolchallenge.service';

@Component({
  selector: 'app-profile-layout',
  templateUrl: './profile-layout.component.html',
  styleUrls: ['./profile-layout.component.css']
})
export class ProfileLayoutComponent implements OnInit, OnDestroy {
  @Input() statistics: any;
  @Output("parentFun") parentFun: EventEmitter<any> = new EventEmitter();
  totalLaplataEarned: any;
  currentUser :any;
  rank = '';
  userCurrentService: Subscription = new Subscription();
  userUpdateService: Subscription = new Subscription();
  constructor(private userService: UserService,private lolChallengeService: LolChallengeService) {
    this.userCurrentService = this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData as any;
      });
  }

  ngOnInit(): void {
    this.getUserRank();
    this.getStatistics();

  }
    getStatistics(): void {
    this.lolChallengeService.getStatistics().subscribe( (res: any) => {
      this.totalLaplataEarned = res.data.totalLaplataEarned;
    });
  }
  onUpload(imgUrl: string) {
    this.userUpdateService = this.userService.update({ image: imgUrl }).subscribe((res: any) => {
      if (res.status === 200) {
        this.userService.setAuth(res.data.user);
        Toast.fire({ icon: 'success', title: 'Profile Image Updated' })
      }
    })
  }

  getUserRank(): void{
    this.userService.getUserRank().subscribe(rankData => {
      this.rank = rankData.data.rank;
    });
  }

  ngOnDestroy() {
    this.userCurrentService.unsubscribe();
    this.userUpdateService.unsubscribe();
  }

}
