import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {
  @ViewChild('content') content: any;
  form!: FormGroup;
  isSubmit = false;
  isLoading = false;

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private userService: UserService) { }

  ngOnInit(): void {

  }
  get() {
    this.userService.currentUser.subscribe(user => {
      if (user) { this.create(user); }
      else {
        this.close();
      }
    });
  }
  create(user: any) {
    this.form = this.formBuilder.group({
      username: [user.username, [Validators.required, Validators.minLength, noWhitespaceValidator]],
      fullName: [user.fullName, [Validators.required, noWhitespaceValidator]],
      image: [user.image],
      email: [user.email, [Validators.required, Validators.email]],
    })
  }

  get f() {
    return this.form.controls;
  }


  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    this.isLoading = true;
    this.userService.updateProfile(this.form.value).subscribe((res: any) => {
      this.isLoading = false;
      if (res.status === 200) {
        this.userService.setAuth(res.data.user);
        Toast.fire({ icon: 'success', title: 'Profile Updated' });
        this.close();
      }
    }, err => {
      if (err.status === 400 && err.error.code === 422.1) {
        this.f.email.setErrors({ emailAlreadyRegistered: err.error.message })
      } else if (err.status === 400 && err.error.code === 422.2) {
        this.f.username.setErrors({ usernameAlreadyRegistered: err.error.message })
      }
      ;
      this.isLoading = false;
    })
  }
  onUpload(fileUrl: string) {
    this.f.image.setValue(fileUrl);
  }

  open() {
    this.get();
    this.modalService.open(this.content, { size: 'md' });
  }
  close() {
    this.modalService.dismissAll()
  }


}
