import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { UpdateProfileComponent } from './update-profile/update-profile.component';



const routes: Routes = [

    {path: '' , component: UpdateProfileComponent},
    {path: 'setting' , component: UpdatePasswordComponent},
    {path: '**' , redirectTo: '', pathMatch: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ProfileRoutingModule { }
