import { Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {LolChallengeService} from '../../../core/services/lolchallenge.service';
import {Toast} from '../../../_constants/SwalToast';
import { ConstantService, UserService } from 'src/app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lolchallenge-earnings',
  templateUrl: './lolchallenge-earnings.component.html',
  styleUrls: ['./lolchallenge-earnings.component.css']
})
export class LolchallengeEarningsComponent implements OnInit {
  @Input() mylaplatasettings: any;
  @Input() statistics: any;
  @Output('parentFun') parentFun: EventEmitter<any> = new EventEmitter();

  isChecked = false;
  currentUser: any = null;
  currentStep = 1;
  form!: FormGroup;
  amount!: number;
  address = '';
  withdrawalHistory: any;
  totalLaplataEarned: any;
  totalLaplataWithdrawn: any;
  laplataAvailableForWithdrawal: any;
  totalLaplataEarnedInThisMonth: any;
  page = 1;
  limit = 10;
  flag = 0;
  totalDocs: any;
  userHeaderService: Subscription = new Subscription();
  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private lolChallengeService: LolChallengeService, private userService: UserService) {
    if (sessionStorage.getItem('authdata') !== null) {
      const authArray = sessionStorage.getItem('authdata');
      this.currentUser = JSON.parse(authArray || '{}');
      console.log('in earnings constructor');

    }
    else {
      this.userHeaderService = this.userService.currentUser.subscribe(
        (userData) => {
          this.currentUser = userData as any;
        }
      );
    }
  }

  ngOnInit(): void {
    if (this.currentUser){
      this.currentStep = 1;
      console.log('earnings init');
      if (localStorage.getItem('savedpaymentdetails') != null){
      this.address = JSON.parse(localStorage.getItem('savedpaymentdetails') || '{}');
    }
      this.totalLaplataEarned = this.statistics?.totalLaplataEarned;

      this.totalLaplataWithdrawn = this.statistics?.withdrwan;
      this.laplataAvailableForWithdrawal = this.statistics?.availableForWithdrawal;
      this.totalLaplataEarnedInThisMonth = this.statistics?.earnedLastMonth;

      this.create();
      this.getWithdrawals();
      this.parentFun.emit();
  }

  }

  create(): void{
    this.form = this.formBuilder.group({
      amount: ['', Validators.required],
      address: ['', Validators.required]

    });
  }

  openLobbyCodePopup(content: any): void {
    this.modalService.open(content, { centered: true });
  }

  stepBack(): void {
    this.currentStep -= 1;
  }

  stepForward(): void {
    this.currentStep += 1;
  }

  getWithdrawals(page?: any) {
    this.lolChallengeService.getWithdrawals({page: page ? page : '1'}).subscribe( (res: any) => {
      this.withdrawalHistory = res.data.docs;
      this.totalDocs = res.data.totalDocs;
    });
  }
noUserToast(){
  Toast.fire({ icon: 'error', titleText: 'Please Login to continue' });
}

 validateWithdrawal() {

  if (this.amount <= this.laplataAvailableForWithdrawal) {

    if (this.amount === 0) {
      Toast.fire({ icon: 'error', title: 'Enter some LAPLATA to withdraw' });
    }
    else if (this.amount < this.mylaplatasettings.minwithdrawal) {
      Toast.fire({ icon: 'error', title: `Minimum Withdrawal amount is ${this.mylaplatasettings.minwithdrawal} LPLT` });
    }
    else {
      this.lolChallengeService.validateAddress(this.address).subscribe((res: any) => {
        console.log(res)
        if (res.data == "1") {
          if (this.isChecked) {
            localStorage.setItem('savedpaymentdetails', JSON.stringify(this.address));
          }
          this.stepForward();
         }
        else if(res.data="0")
        {
          Toast.fire({ icon: 'error', title: 'Enter a valid address' });
        }
      });
    }
  } else {
    Toast.fire({
      icon: 'error',
      title: 'You don’t have enough Laplata to withdraw',
    });
  }
}

  termsChange(selected: any): void {
    if (selected.target.checked) {
      this.isChecked = true;
    }
  }

  createWithdrawal() {
    this.lolChallengeService.createWithdrawal('Bank Transfer', 'Pending', this.amount, this.address).subscribe( (res: any) => {
      this.parentFun.emit();
      this.modalService.dismissAll();
      this.ngOnInit();
    });

  }

  onPageChange(page: any) {
    this.page = page;
    this.getWithdrawals(page);
  }
}
