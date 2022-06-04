import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { VerifyService } from '../verify.service';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmit = false;
  error = 0;
  userForgotSub: Subscription = new Subscription();
  constructor(private formbuilder: FormBuilder, private router: Router,private userService: UserService
    , private verifyService: VerifyService) {
     }

  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.formbuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
  get f() { return this.form.controls; }

  onSubmit(){
    this.error = 0;
    this.isSubmit = true;
    if(this.form.invalid){
      return;
    }


    this.userForgotSub = this.userService.forgotPassword(this.form.value)
    .subscribe((res: any) => {
      if(res.status === 200) {

        this.verifyService.set(this.form.value);
        this.router.navigate(['/auth/verify', ], { queryParams: { returnUrl: this.router.url }});
      }
    }, err=> {
      if(err.status === 401 && err.error.code === 401.1) {this.error = 1;}
   
    });
  }

  ngOnDestroy() {
    this.userForgotSub.unsubscribe();
  }

}
