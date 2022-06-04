import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { FormGroup } from '@angular/forms';
import { ConfirmPasswordValidator } from 'src/app/shared/Validators/confirm-password';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {


  form!: FormGroup;
  isSubmit = false;
  error = 0;

  constructor( private formBuilder: FormBuilder,private router: Router,private userManagementService: UserManagementService) {
    this.create();
  }

  ngOnInit(): void {
  }

  create(){
    this.form = this.formBuilder.group({
      oldPassword: ['', [ Validators.required, PasswordValidator.patternValidator() ]],
      newPassword: ['', [ Validators.required, PasswordValidator.patternValidator() ]],
      confirmPassword: ['', [ Validators.required, PasswordValidator.patternValidator() ]]
    }, {
      validator: ConfirmPasswordValidator('newPassword', 'confirmPassword')
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    this.userManagementService.updatePassword(this.form.value).subscribe((res: any) => {
      if(res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Password Updated' });

        this.router.navigate(['/dashboard']);
      }
    }, err=> {
      if(err.status === 401) {
        this.f.oldPassword.setErrors({wrongPassword: err.error.message})
      }
      
    })
  }

  get f(){
    return this.form.controls;
  }


}
