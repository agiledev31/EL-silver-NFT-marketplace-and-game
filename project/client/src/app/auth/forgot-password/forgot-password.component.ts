import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { CountryISO, PhoneNumberFormat, SearchCountryField, TooltipLabel } from 'ngx-intl-tel-input';

import { UserService } from 'src/app/core';
import { VerifyService } from '../verify.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  form!: FormGroup;
  isSubmit = false;
  isLoading = false;
  error = 0;
  userVerifyResend: Subscription = new Subscription();
  type = 1;

  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [
    CountryISO.UnitedStates,
    CountryISO.UnitedKingdom,
    CountryISO.SouthKorea,
    CountryISO.India,
  ];
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    private verifyService: VerifyService
  ) {
    this.createEmailForm();
  }

  ngOnInit(): void {}

  createEmailForm() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  createPhoneForm() {
    this.form = this.formBuilder.group({
      phone: ['', [Validators.required]],
    });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.error = 0;
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;

    this.userService
      .verifyResend({
        type: this.type,
        sentTo:
          this.type === 1 ? this.f.email.value : this.f.phone.value.e164Number,
      })
      .subscribe(
        (res: any) => {
          if (res.status === 200) {

            this.isLoading = false;
            const value: any = { type: this.type + 2 };
            this.type === 1
              ? (value.email = this.f.email.value)
              : (value.phone = this.f.phone.value.e164Number);
            this.verifyService.set(value);
            this.router.navigate(['/auth/verify'], {
              queryParams: { returnUrl: this.router.url },
            });
          }
        },
        (err) => {
          if (err.status === 401 && err.error.code === 401.1) {
            this.error = 1;
          } else if (err.status === 401 && err.error.code === 401.2) {
            this.error = 2;
          }

          this.isLoading = false;
        }
      );
  }

  onTypeClick(type: number) {
    this.type = type;
    if (type === 1) {
      this.createEmailForm();
    } else {
      this.createPhoneForm();
    }
  }


  ngOnDestroy() {
    this.userVerifyResend.unsubscribe();
  }

}
