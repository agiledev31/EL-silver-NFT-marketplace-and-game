import { Component, OnInit } from '@angular/core';
import { ConstantService, UserService } from 'src/app/core';
import { Subscription } from 'rxjs';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-referrals',
  templateUrl: './referrals.component.html',
  styleUrls: ['./referrals.component.css'],
})
export class ReferralsComponent implements OnInit {
  ReferralCode: any = '';
  ReferrerCode: any;
  currentUser: any = null;
  userHeaderService: Subscription = new Subscription();

  constructor(private userService: UserService) {
    if (sessionStorage.getItem('authdata') !== null) {
      const authArray = sessionStorage.getItem('authdata');
      this.currentUser = JSON.parse(authArray || '{}');
      this.ReferralCode = this.currentUser.referralcode;
      console.log('in lolchallenge constructor');
    } else {
      this.userHeaderService = this.userService.currentUser.subscribe(
        (userData) => {
          this.currentUser = userData as any;
          this.ReferralCode = this.currentUser.referralcode;
          sessionStorage.setItem('authdata', JSON.stringify(this.currentUser));
        }
      );
    }
  }

  ngOnInit(): void {}

  onReferrerSubmit() {
    this.userService.applyReferralCode(this.ReferrerCode).subscribe(
      (res: any) => {
        if (res.status == 200) {
          Toast.fire({
            icon: 'success',
            title: 'Referral Applied Successfully',
          });
          sessionStorage.removeItem('authdata');
          this.currentUser.referrercode = this.ReferrerCode;
          this.userService.populate();
        } else {
          Toast.fire({
            icon: 'error',
            title: 'Please enter Valid Referral Code',
          });
        }
      },
      (err) => {
        Toast.fire({
          icon: 'error',
          title: 'Please enter Valid Referral Code',
        });
      }
    );
  }

  GenerateCode() {
    this.userService.generateReferralCode().subscribe(
      (res: any) => {
        if (res.status == 200) {
          Toast.fire({ icon: 'success', title: 'Referral Code Generated' });
          sessionStorage.removeItem('authdata');
          this.ReferralCode = res.data.CODE;
          this.userService.populate();
        } else {
          Toast.fire({ icon: 'error', title: 'Something went wrong' });
        }
      },
      (err) => {
        Toast.fire({ icon: 'error', title: 'Server Error' });
      }
    );
  }

  copyText() {
    navigator.clipboard.writeText(this.ReferralCode);
    Toast.fire({ icon: 'success', title: 'Copied To ClipBoard' });
  }
}
