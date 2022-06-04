import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TradeService, UserService } from 'src/app/core';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  isLoader = false;
  trade:any = null;
  silver:any = null;
  currentUser:any = null;

  amount ='';
  silverAmount ='';
  isRead = false;

  isBtnLoader = false;
  tradeId :any = null;
  constructor(private route: ActivatedRoute, private router: Router,private tradeService: TradeService, private userService: UserService) {
    this.tradeService.currentSilver.subscribe((silver:any) =>  this.silver = silver)
    this.userService.currentUser.subscribe((userData : any) => this.currentUser = userData);

   }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.tradeId = params['id'];
      if(this.tradeId) {
        this.get(this.tradeId);
        this.tradeService.getP2PEvent(this.tradeId).subscribe(res => this.get(this.tradeId));
      }else {
        this.router.navigate(['/trade/p2p'], { queryParams: {trade: 'buy'} });
      }

    });
  }
  get isGreater() { return this.silverAmount > this.trade.silver}
  get(tradeId: string){
    this.isLoader = true;
    this.tradeService.getP2PTradeById(tradeId).subscribe(res => {
      this.isLoader = false;
      if(res.status === 200) {
        this.trade = res.data.trade;

      }
    }, err => {
      this.isLoader = false;

    })
  }
  openTrade() {
    this.isBtnLoader = true;
    this.tradeService.updateP2PTradeRequestOpen({amount: this.amount, silver: this.silverAmount },this.trade._id).subscribe(res => {
    this.isBtnLoader = false;
      if(res.status) {
      Toast.fire({ icon: 'success', title: 'Trade Opened Successfully' })
      let request = this.trade.requests.find((e:any) => e.user._id == this.currentUser._id);
        this.router.navigate(['/trade/p2p/', this.trade._id,'request',res.data._id]);
      }
    }, err => {
    this.isBtnLoader = false;
    Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })

    ;
    })
  }

  getMarginPrice(silver: number, margin: number) {
    let pricePerGram = this.silver? this.silver.price / 31: 0;
    return silver * (pricePerGram+(pricePerGram* (margin/100)));
  }

  get isMine() { return this.currentUser && this.trade && this.currentUser._id == this.trade.user._id }
  get isOpenedForMe() {return  this.currentUser && this.trade && this.trade.requests && (this.trade.requests as []).filter((e:any) => e.user._id === this.currentUser._id).length > 0 }



  onAmountKeyup() {
    let pricePerGram = this.silver? this.silver.price / 31: 0;
    let p = (+this.amount / (pricePerGram+(pricePerGram* (this.trade.margin/100))));

    this.silverAmount = p === 0? '': p.toFixed(2).toString()
  }
  onSilverAmountKeyup() {
    let price = this.getMarginPrice(this.silverAmount === '' ? 0 :  +this.silverAmount, this.trade.margin);
    this.amount = price == 0 ? '' : price.toFixed(2).toString();
  }
  get getActiveRequests() { return this.trade? this.trade.requests.filter((e :any)=> {
    if(e.status !== 0 || e.status !== 1 || e.status !== 2) {return e;}
    // else if(this.requestType == 1 && e.status ===1 ) {return e}
    // else if(this.requestType == 2 && e.status ===2 ) {return e}
    // else if(this.requestType == 3 && e.status ===3 ) {return e}
    // else if(this.requestType == 4 && e.status ===4 ) {return e}


  }): []; }
  goToRequest() {
    this.router.navigate(['/trade/p2p/', this.trade._id,'request',this.trade.requests.find((e:any) => e.user._id == this.currentUser._id)._id])
  }

  onRequestStatusChange(req: any, status: number) {
    this.tradeService.updateP2PTradeRequestStatus({status: status},this.trade._id, req._id)
    .subscribe((res:any) => {
      if(res.status === 200 ) {

        this.router.navigate(['/trade/p2p/', this.trade._id,'request',req._id]);
        Toast.fire({ icon: 'success', title: status == 2? 'Request confirmed' : 'Request denied', })

      }
    }, (err:any )=> {
      Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })


    });
  }

}


