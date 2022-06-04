import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {


  form: FormGroup;
  isSubmit = false;
  constructor(private router: Router ,private formBuilder:FormBuilder, private userManagementService: UserManagementService, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if(user){this.create(user);}
      else {
        this.router.navigate(['/dashboard']);
      }
    })
  }
  create(user) {
    this.form = this.formBuilder.group({
      username: [user.username, [Validators.required, Validators.minLength, noWhitespaceValidator ]],
      fullName: [user.fullName, [Validators.required, noWhitespaceValidator ]],
      image: [user.image],
      email  : [user.email, [Validators.required,Validators.email]],
    });
  }
  get f() { return this.form.controls; }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    this.userManagementService.updateProfile(this.form.value).subscribe((res: any) => {
      if(res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Profile Updated' });
        this.userService.setAuth(res.data.user)
        this.router.navigate(['/dashboard']);
      }
    }, err=> {
      if(err.status === 400 && err.error.code === 422.1) {
        this.f.email.setErrors({emailAlreadyRegistered: err.error.message})
      } else if(err.status === 400 && err.error.code === 422.2) {
        this.f.username.setErrors({usernameAlreadyRegistered: err.error.message})
      }
      
    })
  }

  IsSuperCheck(val)
  {
    if(val.target.checked) {
      this.f.role.setValue(3);
    } else {
      this.f.role.setValue(2);

    }
  }
  onUpload(fileUrl) {
    this.f.image.setValue(fileUrl);
  }
}
