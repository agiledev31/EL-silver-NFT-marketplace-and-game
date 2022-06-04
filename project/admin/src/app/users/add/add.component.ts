import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { Router } from '@angular/router';
import { Toast } from 'src/app/_constants/SwalToast';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {


  form: FormGroup;
  isSubmit = false;
  constructor(private router: Router ,private formBuilder:FormBuilder, private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.create()
  }
  create() {
    this.form = this.formBuilder.group({
      role: [2, Validators.required],
      username: ['', [Validators.required, Validators.minLength, noWhitespaceValidator ]],
      fullName: ['', [Validators.required, noWhitespaceValidator ]],
      image: [''],
      email  : ['', [Validators.required,Validators.email]],
    });
  }
  get f() { return this.form.controls; }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    this.userManagementService.createUser(this.form.value).subscribe((res: any) => {
      if(res.status === 200) {
        Toast.fire({ icon: 'success', title: 'User Added' });
        this.router.navigate(['/users']);
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
