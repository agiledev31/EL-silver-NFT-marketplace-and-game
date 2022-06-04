import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core';
import { VerifyService } from './../verify.service';
import { Subscription } from 'rxjs';
import { Toast } from 'src/app/_constants/SwalToast';
@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  otp = '';
  type = 2;
  sentTo = '';
  returnUrl = '';
  isResendLoading = false;
  error = '';
  isLoading = false;
  userVerifyService: Subscription = new Subscription();
  userVerifyResend: Subscription = new Subscription();
  userVerify: Subscription = new Subscription();
  verifyType = 2;
  constructor(
    private verifyService: VerifyService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/auth/login';
    this.userVerifyService = this.verifyService.currentValue.subscribe(
      (value) => {
        if (value) {
          this.verifyType = value.type;
          if (value.type > 2) {
            this.type = value.type % 2 === 0 ? 2 : 1;
          } else {
            this.type = value.type;
          }
          if (this.type === 1) {
            this.sentTo = value.email;
          }
          if (this.type === 2) {
            this.sentTo = value.phone;
          }
        } else {
          this.router.navigate([this.returnUrl]);
        }
      }
    );
  }

  onOtpChange(otp: string) {
    this.otp = otp;

    if (this.otp.length === 4) {
      this.onSubmit();
    }
  }

  onChangeClick() {
    this.router.navigateByUrl(this.returnUrl);
  }

  onResendClick() {
    this.isResendLoading = true;
    this.userVerifyResend = this.userService
      .verifyResend({ type: this.type, sentTo: this.sentTo })
      .subscribe(
        (res: any) => {
          if (res.status === 200) {
            this.isResendLoading = false;

            Toast.fire({ icon: 'success', title: 'OTP sent successfully' });
          }
        },
        (err) => { }
      );
  }

  onSubmit() {
    if (this.otp.length < 4) {
      return;
    }
    this.isLoading = true;

    this.userVerify = this.userService
      .verify({ type: this.type, otp: this.otp, sentTo: this.sentTo })
      .subscribe(
        (res: any) => {
          this.isLoading = false;

          if (res.status === 200) {
            if (this.verifyType <= 2) {
              this.userService.setAuth(res.data.user);
              this.verifyService.purge();
              Toast.fire({ icon: 'success', titleText: 'Successfully logged in' });
              this.router.navigate(['/profile']);
            } else {
              this.router.navigate(['/auth/reset-password']);
            }
          }
        },
        (err) => {
          if (err.status === 401 && err.error.code === 401.1) {
            this.error = err.error.message;
            this.isLoading = false;
          }
        }
      );
  }

  ngOnDestroy() {
    this.userVerifyService.unsubscribe();
    this.userVerifyResend.unsubscribe();
    this.userVerify.unsubscribe();
  }
}
