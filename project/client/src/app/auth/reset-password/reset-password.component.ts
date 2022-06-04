import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { ConfirmPasswordValidator } from 'src/app/shared/Validators/confirm-password';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { VerifyService } from './../verify.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit,OnDestroy {
  form!: FormGroup;
  isSubmit = false;
  isPasswordShow = false;
  isConfirmPasswordShow = false;
  userVerifyService: Subscription = new Subscription();
  userResetPassword: Subscription = new Subscription();
  type = 1;
  sentTo = '';
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private verifyService:VerifyService) {
    this.create();
    this.userVerifyService = this.verifyService.currentValue.subscribe((value: any) => {
      if(value) {
        if(value.type > 2) {
          this.type = value.type % 2 === 0 ? 2 : 1;
        } else {
          this.type = value.type;
        }
    if(this.type === 1) {this.sentTo = value.email;}
    if(this.type === 2) {this.sentTo = value.phone;}
      }else {
        this.router.navigate(['/auth/login']);
      }
    })
  }

  ngOnInit(): void {
    this.userVerifyService = this.verifyService.currentValue.subscribe(value => {
      if(value.type > 2) {

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
  get f(){
    return this.form.controls;
  }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) { return; }

    // call the service
    // also set the validators of email not Exist
    this.userResetPassword = this.userService.resetPassword({...this.form.value, type : this.type, sentTo : this.sentTo})
      .subscribe((res: any) => {
        if(res.status === 200){
          this.router.navigate(['/auth']);
          this.verifyService.purge();
        }
      },
        err => {
          
        });


  }
  onPasswordShowHideClick() {
    this.isPasswordShow = !this.isPasswordShow;
  }
  onConfirmPasswordShowHideClick() {
    this.isConfirmPasswordShow = !this.isConfirmPasswordShow;
  }

  ngOnDestroy() {
    this.userVerifyService.unsubscribe();
    this.userResetPassword.unsubscribe();
  } 

}
