import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { TradeService } from 'src/app/core/services/trade.service';
import { SuccessComponent } from 'src/app/shared/success/success.component';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-instant',
  templateUrl: './instant.component.html',
  styleUrls: ['./instant.component.css']
})
export class InstantComponent implements OnInit, OnDestroy {

  type = 1;
  userActivateRoute: Subscription = new Subscription();

  form!: FormGroup;
  currentUser : any;
  silver: any;
    @ViewChild(SuccessComponent) successComponent!:SuccessComponent;
  constructor(private activatedRoute: ActivatedRoute,private formBuilder: FormBuilder, private userService: UserService, private tradeService: TradeService) {
    this.tradeService.currentSilver.subscribe((silver:any) =>  this.silver = silver)

    this.userService.currentUser.subscribe(user => this.currentUser = user);
   this.userActivateRoute = this.activatedRoute.params.subscribe(params => {
          this.type = params['type'] && params['type'] == 'sell'? 2 : 1;

      });
  }
  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      silver: ['', Validators.required]
    });
  }
  get f() {return this.form.controls;}
  get isProceedBtnDisable() {
    return this.form.valid && this.currentUser && ( this.type === 1 && +this.f.amount.value < this.currentUser.balance ||
       this.type === 2 && +this.f.silver.value < this.currentUser.silver) ; }
  onProceedClick() {
    // TODO alert for confirmation
    let sub = null;
    if(this.type=== 1) {
      sub = this.tradeService.instantBuyTrade(this.form.value);
    } else {
      sub = this.tradeService.instantSellTrade(this.form.value);
    }
    sub.subscribe((res: any)=> {
      if(res.status === 200) {
        this.successComponent.title = `${this.type=== 1 ? 'Buy':'Sell'} Transaction Successful!`;
        this.successComponent.text = `Your transaction of $${this.f.amount.value} was successful`;
            this.successComponent.open();
      }
    }, err => {
      Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })
    })
  }
  onAmountKeyUp(){
    if(this.f.amount.value == ''){
      return this.f.silver.setValue('');
    }
    this.f.silver.setValue((+this.f.amount.value/(this.silver.price/31)).toFixed(2));
  }
  onSilverKeyUp() {
    if(this.f.silver.value == ''){
      return this.f.amount.setValue('');
    }
    this.f.amount.setValue((+this.f.silver.value*(this.silver.price/31)).toFixed(2));
  }
  ngOnDestroy() {
    this.userActivateRoute.unsubscribe();
  }
}
