import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupLayoutComponent } from './signup-layout/signup-layout.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginEmailComponent } from './login-email/login-email.component';
import { LoginPhoneComponent } from './login-phone/login-phone.component';
import { SignupEmailComponent } from './signup-email/signup-email.component';
import { SignupPhoneComponent } from './signup-phone/signup-phone.component';
import { VerifyComponent } from './verify/verify.component';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
import { NgOtpInputModule } from 'ng-otp-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  declarations: [SignupLayoutComponent, LoginLayoutComponent, LoginEmailComponent, LoginPhoneComponent, SignupEmailComponent, SignupPhoneComponent, VerifyComponent, ForgotPasswordComponent, ResetPasswordComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule,
    NgOtpInputModule,
    NgxIntlTelInputModule,
  ]
})
export class AuthModule { }
