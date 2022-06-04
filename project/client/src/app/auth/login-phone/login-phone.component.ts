import { Component, OnInit,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { UserService } from 'src/app/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { VerifyService } from '../verify.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login-phone',
  templateUrl: './login-phone.component.html',
  styleUrls: ['./login-phone.component.css']
})
export class LoginPhoneComponent implements OnInit, OnDestroy {

  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.India, CountryISO.SouthKorea];
  form!: FormGroup;

  isSubmit = false;
  isLoading = false;
  error = false;
  userLoginPhone: Subscription = new Subscription();

  constructor(private formBuilder: FormBuilder, private userService: UserService, private verifyService: VerifyService, private router: Router,) {
    this.create();
  }

  ngOnInit(): void {
  }

  create(){
    this.form = this.formBuilder.group({
      phone: ['', Validators.required]
    })
  }

  get f(){
    return this.form.controls;
  }

  // onSubmit(){
  //   this.isSubmit = true;
  //   if(this.form.invalid){
  //     return;
  //   }
  //   this.isLoading = true;

  //   this.userLoginPhone = this.userService.loginPhone({phone : this.f.phone.value.e164Number}).subscribe((res: any) => {
  //     if(res.status === 200) {
  //       this.verifyService.set({phone: this.f.phone.value.e164Number, type: 2});
  //       console.log(' Here is your OTP', res.data.OTP);
  //       this.router.navigate(['/auth/verify'], { queryParams: { returnUrl: this.router.url }});
  //       this.isLoading = false;
  //     }
  //   }, err => {
  //     if(err.status === 401 && err.error.code === 401.1) {
  //       this.error = true;
  //     }
  //     ;
  //     this.isLoading = false;
  //   })
  // }

  onSubmit(){
    swal.fire({
      title: 'Login with Phone is currenly disabled',
      text: `Please Login with Google or Email`,
      icon: 'warning',
    }).
    then(
      ()=> location.reload()
    )

  }

  ngOnDestroy() {
    this.userLoginPhone.unsubscribe();
  }

}
