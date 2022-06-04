import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SearchCountryField, TooltipLabel, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { UserService } from 'src/app/core';
import { VerifyService } from '../verify.service';
import swal from 'sweetalert2';


@Component({
  selector: 'app-signup-phone',
  templateUrl: './signup-phone.component.html',
  styleUrls: ['./signup-phone.component.css']
})
export class SignupPhoneComponent implements OnInit, OnDestroy {

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
	TooltipLabel = TooltipLabel;
	CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;
  preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.India];
  form!: FormGroup;

  error = false;
  isSubmit = false;
  isLoading = false;
  userSignUpPhone: Subscription = new Subscription();
  constructor(private formBuilder: FormBuilder,private userService: UserService, private verifyService: VerifyService, private router: Router) {
    this.create();
  }

  ngOnInit(): void {
  }

  create(){
    this.form = this.formBuilder.group({
      fullName: ['', Validators.required],
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
  //   this.userSignUpPhone = this.userService.signUpPhone({fullName : this.f.fullName.value , phone : this.f.phone.value.e164Number}).subscribe((res: any) => {
  //     if(res.status === 200) {
  //       this.verifyService.set({phone: this.f.phone.value.e164Number, type: 2});
  //       //console.log(' Here is your OTP', res.data.OTP);
  //       this.isLoading = false;
  //       this.router.navigate(['/auth/verify'], { queryParams: { returnUrl: this.router.url }});

  //     }
  //   }, err => {
  //     if(err.status === 400 && err.error.code === 422.3) {
  //       this.f.phone.setErrors({phoneAlreadyRegistered: err.error.message})
  //     }
  //     ;
  //     this.isLoading = false;
  //   })
  // }

  onSubmit() {
    swal.fire({
      title: 'Signup with Phone is currenly disabled',
      text: `Please Signup with Email for some time`,
      icon: 'warning',
    }).
      then(
        () => location.reload()
      )

  }

  ngOnDestroy() {
    this.userSignUpPhone.unsubscribe();
  }

}
