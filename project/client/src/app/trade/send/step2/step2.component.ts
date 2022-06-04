import { Component, OnInit, ViewChild,  } from '@angular/core';
import { ConstantService, UserService, TradeService } from 'src/app/core';
import { SendService } from './../send.service';
import { Router } from '@angular/router';
import { SuccessComponent } from 'src/app/shared/success/success.component';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css'],
})
export class Step2Component implements OnInit {
  selectedFriends :any =  null;
  @ViewChild(SuccessComponent) successComponent!:SuccessComponent;

  currentUser: any = null;
  sameAmount = 0;
  isSameAmount = false;
  constructor(
    private sendService: SendService,
    private router: Router,
    private userService: UserService,
    public constant:ConstantService,
    private tradeService:TradeService
  ) {}

  ngOnInit(): void {
    this.sendService.friends.subscribe((friends) => {
      if (friends) {
        this.selectedFriends = friends.map((e: any) => {
          return { ...e, silver: 0 };
        });
      } else {
        this.router.navigate(['/trade/send/1']);
      }
    });

    this.userService.currentUser.subscribe((user) => (this.currentUser = user));
  }
  onAllSameAmountClick(e:any) {
    this.isSameAmount = e.target.checked
  }

get total(): number {
  if(this.isSameAmount) {
    return this.selectedFriends?  this.selectedFriends.length * (this.sameAmount+ parseFloat(this.constant.system.sendSilverFee)) : 0;
  } else {
    return this.selectedFriends? +this.selectedFriends.reduce( (sum: number, friend:any ) => sum + parseFloat(friend.silver? friend.silver: 0) +  parseFloat(this.constant.system.sendSilverFee), 0 ) : 0;
  }
 }
 get isOwn() {return this.currentUser  && this.currentUser.silver > this.total}
  onClickSend() {
    if(this.total <= 0){ return;}

    if(this.isSameAmount) {
      this.selectedFriends = this.selectedFriends.map((e: any) => {return {...e, silver:this.sameAmount}});
    }
    this.tradeService.sendSilverToFriend(this.selectedFriends).subscribe(res => {
      if(res.status === 200) {
        this.successComponent.title = `Silver Sent to Friends Successful!`;
        this.successComponent.text = `Your transaction of $${this.total}gm Silver was successful`;
            this.successComponent.open();
            this.sendService.friendsSubject.next(null);
            this.router.navigate(['/trade/send/1']);
      }
    } , err => {
      Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })
      
    })
  }
  get isSendDisable() {return  !( this.total >= 1 &&this.isOwn)}
}
