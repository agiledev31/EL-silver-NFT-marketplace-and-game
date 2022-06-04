import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService, TradeService } from 'src/app/core';
import { SuccessComponent } from 'src/app/shared/success/success.component';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-trade',
  templateUrl: './trade.component.html',
  styleUrls: ['./trade.component.css']
})
export class TradeComponent implements OnInit {

  public isMenuCollapsed = true;
  public isMenuCollapsed1 = true;

  voucher = '';
  voucherErr = '';
  currentUser = null;
  isLoader = false;
  @ViewChild(SuccessComponent) successComponent!:SuccessComponent;
  constructor(private userService: UserService, private tradeService:TradeService) {
        this.userService.currentUser.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
  }
  AlertForWallet(){
Toast.fire({ icon: 'error', titleText: 'It can\'t be supported in your region . Use P2P instead' })
  }
  onVoucherSubmit() {
    this.isLoader = true;
    this.voucherErr = '';
    if(this.voucher !== '') {
      this.tradeService.redeemVoucher(this.voucher).subscribe(res => {
    this.isLoader = false;

        if(res.status === 200) {
          this.successComponent.title = `Voucher redeemed Successful!`;
          this.successComponent.text = `Your voucher  ${this.voucher} has redeemed successfully`;
              this.successComponent.open();
          this.voucher = '';

        } else {
        this.voucherErr = 'Voucher Code is invalid';

        }
      }, err  => {
    this.isLoader = false;
        if(err.status == 400) {
          this.voucherErr = err.error.message || 'Voucher Code is invalid';
        } else {
      Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })

        }

      })

    } else {
    this.isLoader = false;
    }
  }
}
