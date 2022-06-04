import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TradeService } from 'src/app/core';
import { UserService } from './../../../core/services/user.service';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  p2pType = 1;

  p2pId: any = null;
  requestId: any = null;

  isLoader = false;
  trade:any = null;
  request:any = null;
  currentUser: any = null;
  constructor(private router: Router, private userService: UserService ,private route: ActivatedRoute, private tradeService: TradeService) {
   this.userService.currentUser.subscribe((user: any) => this.currentUser = user);
    this.route.params.subscribe((params :any)=> {
     this.p2pId = params['id'];

    this.requestId = params['requestId'];

    this.tradeService.getP2PEvent(this.p2pId).subscribe(res => this.getTradePost());
    this.isLoader = true;

     this.getTradePost();
   });
  }
  ngOnInit(): void {
  }
  getTradePost() {
    this.tradeService.getP2PTradeById(this.p2pId).subscribe(res => {
      this.isLoader = false;
      if(res.status === 200) {
        this.trade = res.data.trade;
        this.request = this.trade.requests.find((e:any) => e._id == this.requestId);
      }
    }, err => {
      this.isLoader = false;

    })
  }
  get isMeSeller() { return this.currentUser && this.trade && (this.currentUser._id === this.trade.user._id && this.trade.type === 2) || (this.request.user._id === this.currentUser._id && this.trade.type == 1)}
  get getStatus() {
    if(this.request && this.request.status === 0) {
      return 'Denied'
    } else if(this.request && this.request.status === 1) {
      return 'Pending'
    }
    else if(this.request && this.request.status === 2) {
      return 'payment incomplete'
    } else if (this.request && this.request.status === 3) {
      return 'payment completed'
    } else if(this.request && this.request.status === 4 ) {
      return 'Silver released'
    }else {
      return 'completed'
    }
  }
  onChangeStatus(status: any) {
    this.tradeService.updateP2PTradeRequestStatus({status}, this.trade._id, this.request._id).subscribe(res => {
      if(res.status === 200) {
        let title ='';
        if(status == 2) title ='Payment Completed'
        else if(status == 4) title ='Payment Confirmed and Silver released'
      Toast.fire({ icon: 'success', title: title })

      }
    }, err=> {
    Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })

    })
  }
}
