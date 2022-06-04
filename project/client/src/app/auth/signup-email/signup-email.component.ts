import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/core';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfirmPasswordValidator } from 'src/app/shared/Validators/confirm-password';
import { VerifyService } from '../verify.service';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signup-email',
  templateUrl: './signup-email.component.html',
  styleUrls: ['./signup-email.component.css']
})
export class SignupEmailComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isSubmit = false;
  isLoading = false;
  isPasswordShow = false;
  userSignUpEmail: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, private userService: UserService, private verifyService: VerifyService, private router: Router) {
    this.create();
  }

  ngOnInit(): void {
  }

  create() {
    this.form = this.formBuilder.group({
      fullName: ['', [Validators.required, noWhitespaceValidator]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(255), noWhitespaceValidator]],
      password: ['', [Validators.required, PasswordValidator.patternValidator()]],
      confirmpassword: ['', [Validators.required, PasswordValidator.patternValidator()]]
    }, {
      validator: ConfirmPasswordValidator('password', 'confirmpassword')
    })
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.form.value.url = environment.frontend_url;
    this.userSignUpEmail = this.userService.signUpEmail(this.form.value).subscribe((res: any) => {

      this.isLoading = false;
      if (res.status === 200) {
        Swal.fire({
          icon: 'success',
          text: 'Verification link has been sent to your email!',
        })
        this.router.navigate(['/auth/login']);

        // this.verifyService.set({ email: this.f.email.value, type: 1 });
        this.isLoading = false;
        //  this.router.navigate(['/auth/verify'], { queryParams: { returnUrl: this.router.url } });
      }
    }, err => {
      if (err.status === 400 && err.error.code === 422.1) {
        this.f.email.setErrors({ emailAlreadyRegistered: err.error.message })
      } else if (err.status === 400 && err.error.code === 422.2) {
        this.f.username.setErrors({ usernameAlreadyRegistered: err.error.message })
      }

      this.isLoading = false;
    })
  }
  onPasswordShowHideClick() {
    this.isPasswordShow = !this.isPasswordShow;
  }

  ngOnDestroy() {
    this.userSignUpEmail.unsubscribe();
  }

}
