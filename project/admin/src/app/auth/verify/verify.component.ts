import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core';
import { Subscription } from 'rxjs';
import { VerifyService } from '../verify.service';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit, OnDestroy {

  otp = '';
  email = '';
  isResendLoading = false;
  error = '';
  returnUrl = '';
  userVerifyService: Subscription = new Subscription();
  userForgotPassword: Subscription = new Subscription();
  userVerify: Subscription = new Subscription();
  constructor(private verifyService: VerifyService , private userService: UserService ,  private route: ActivatedRoute,private router: Router) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/auth/login';
      this.userVerifyService =  this.verifyService.currentValue.subscribe(value => {
          if(value && value.email) {

              this.email = value.email;
          } else if(!value) {
            this.router.navigate([this.returnUrl]);
          }

    })
  }
  onOtpChange(otp: string) {
    this.otp = otp;
    if(this.otp.length === 4) {
      this.onSubmit();
    }
  }
  onChangeClick() {
    this.router.navigateByUrl(this.returnUrl);
  }
  onResendClick () {
    this.isResendLoading = true;

   this.userForgotPassword = this.userService.forgotPassword({email: this.email}).subscribe((res: any) => {
      if(res.status === 200) {
      this.isResendLoading = false;
        Toast.fire({ icon: 'success', title: 'OTP sent successfully' })

      }
    }, err => {
    })
    // resend otp here
  }
  onSubmit() {
    if(this.otp.length< 4) { return; }

     this.userVerify = this.userService.verify({otp: this.otp, email: this.email}).subscribe((res: any) => {
        if(res.status == 200) {
            this.router.navigate(['/auth/reset-password' ]);
        }
      }, err => {
        if(err.status === 401 && err.error.code === 401.1) {
          this.error = err.error.message;
        }
      })
  }

  ngOnDestroy() {
    this.userVerifyService.unsubscribe();
    this.userForgotPassword.unsubscribe();
    this.userVerify.unsubscribe();
  }

}
