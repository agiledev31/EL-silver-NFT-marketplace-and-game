import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { SignupLayoutComponent } from './signup-layout/signup-layout.component';
import { VerifyComponent } from './verify/verify.component';


const routes: Routes = [
  {path: 'signup', component: SignupLayoutComponent},
  {path: 'login', component: LoginLayoutComponent},
  {path: 'email-verification/:token', component: LoginLayoutComponent},
  {path: 'verify', component: VerifyComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: '', redirectTo: 'login', pathMatch: 'full'},

];

@NgModule({
imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class AuthRoutingModule { }
