import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { SharedModule } from './../shared/shared.module';

import { AuthRoutingModule } from './auth-routing.module';
import { VerifyComponent } from './verify/verify.component';
import { VerifyService } from './verify.service';
import { NgOtpInputModule } from 'ng-otp-input';


@NgModule({
  declarations: [LoginComponent,  ForgotpasswordComponent, ResetpasswordComponent, VerifyComponent,],
  imports: [
  CommonModule,
    SharedModule,
    AuthRoutingModule,
    NgOtpInputModule
  ],
  providers: [VerifyService]
})
export class AuthModule { }
