import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { VerifyComponent } from './verify/verify.component';



const routes: Routes = [

    {path: '' , component: LoginComponent},
    {path: 'forgot-password' , component: ForgotpasswordComponent},
    {path: 'reset-password' , component: ResetpasswordComponent},
    {path: 'verify' , component: VerifyComponent},
    {path: '**' , redirectTo: '', pathMatch: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class AuthRoutingModule { }
