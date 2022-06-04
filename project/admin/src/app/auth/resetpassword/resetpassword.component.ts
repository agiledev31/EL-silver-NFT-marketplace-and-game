import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { VerifyService } from '../verify.service';
import { ConfirmPasswordValidator } from './../../shared/Validators/confirm-password';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.css']
})
export class ResetpasswordComponent implements OnInit,OnDestroy {
  form: FormGroup;
  isSubmit = false;
  email = '';
  error = '';
  userVerifyService: Subscription = new Subscription();
  userResetPassword: Subscription = new Subscription();
  constructor(private formBuilder: FormBuilder, private router: Router, private verifyService: VerifyService , private userService: UserService ,) { }

  ngOnInit(): void {
    this.create();

   this.userVerifyService = this.verifyService.currentValue.subscribe(value => {
      if(value && value.email) {
          this.email = value.email;
      } else if(!value) {
        this.router.navigate(['auth/forgot-password']);
      }

})
  }

  create() {
    this.form = this.formBuilder.group({
      confirmPassword: ['', Validators.required],
      password: ['', [Validators.required, PasswordValidator.patternValidator()]]
    }, {
      validator: ConfirmPasswordValidator('password', 'confirmPassword')
    });
  }

  get f() { return this.form.controls; }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    // call the service
    // also set the validators of email not Exist
    this.userResetPassword = this.userService.resetPassword({...this.form.value, email : this.email})
      .subscribe((res: any) => {
        if(res.status === 200){
          this.router.navigate(['/auth']);
          this.verifyService.purge();
        }
      },
        err => {
        });


  }

  ngOnDestroy() {
    this.userVerifyService.unsubscribe();
    this.userResetPassword.unsubscribe();
  }  

}
