import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { SocialAuthService, GoogleLoginProvider } from 'angularx-social-login';
import { Toast } from 'src/app/_constants/SwalToast';
import { ActivatedRoute } from '@angular/router';
import { VerifyService } from '../verify.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-login-email',
  templateUrl: './login-email.component.html',
  styleUrls: ['./login-email.component.css']
})
export class LoginEmailComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isSubmit = false;
  isLoading = false;
  type = 2;
  sentTo = '';
  returnUrl = '';
  isResendLoading = false;
  userVerifyService: Subscription = new Subscription();
  userVerifyResend: Subscription = new Subscription();
  userVerify: Subscription = new Subscription();
  verifyType = 2;
  isPasswordShow = false;
  error = 0;
  userLoginEmail: Subscription = new Subscription();
  token: any;
  isErrorMessage = false;
  constructor(private verifyService: VerifyService, private formBuilder: FormBuilder, private userService: UserService, private router: Router,
    private socialAuthService: SocialAuthService,
    private activatedrouted: ActivatedRoute,
  ) {
    this.create();
  }


  ngOnInit(): void {

    this.userVerifyService = this.verifyService.currentValue.subscribe(
      (value) => {
        if (value) {
          this.verifyType = value.type;
          if (value.type > 2) {
            this.type = value.type % 2 === 0 ? 2 : 1;
          } else {
            this.type = value.type;
          }
        }
      })

    this.activatedrouted.paramMap.subscribe(params => {
      this.token = params.get('token')
      if (this.token) {
        this.verifyToken(this.token)
      }
    })


  }

  create() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, PasswordValidator.patternValidator()]]
    })
  }

  get f() {
    return this.form.controls;
  }

  verifyToken(token: any) {

    this.isLoading = true;
    this.userService
      .verify({ type: this.type, token: token })
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
            Swal.fire({
              icon: 'error',
              text: err.error.message,
            })

            this.isLoading = false;
          }
        }
      );
  }

  onSubmit() {
    this.error = 0;
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    this.userLoginEmail = this.userService.loginEmail(this.form.value).subscribe((res: any) => {

      this.isLoading = false;

      if (res.status === 200) {

        this.userService.setAuth(res.data.user);
        Toast.fire({ icon: 'success', titleText: 'Successfully logged in' });
        this.router.navigate(['/profile']);
      }
    }, err => {
      if (err.status === 401) { 
        if(err.error.code === 401.2){
          this.isErrorMessage = true
          this.error = 3;
        }
        else{
          this.isErrorMessage = false
          this.error = 1; 
        }
      }
      // if (err.status === 401.2) {
      //   this.isErrorMessage = true;
      // }

      this.isLoading = false;

    })
  }
  onPasswordShowHideClick() {
    this.isPasswordShow = !this.isPasswordShow;
  }
  signInWithGoogle(): void {
    // this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(x => console.log(x));
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then(user =>
      this.userService.loginGoogle({ ...user, fullName: user.name })
        .subscribe((res: any) => {
          this.userService.setAuth(res.data.user);
          Toast.fire({ icon: 'success', titleText: 'Successfully logged in' });
          this.router.navigate(['/']);
        })
    );
  }
  ngOnDestroy() {
    this.userLoginEmail.unsubscribe();
  }

  resendLink() {
    this.form.value.url = environment.frontend_url;
    this.form.value.type = this.type;
    this.userService.verifyResend(this.form.value)
      .subscribe((res: any) => {
        if (res.status == 200) {
          this.isErrorMessage = false;
          Swal.fire({
            icon: 'success',
            text: 'Verification link has been sent to your email!',
          }).then(() => {
            this.router.navigate(['/']);
          })
        }
      })
  }
}
