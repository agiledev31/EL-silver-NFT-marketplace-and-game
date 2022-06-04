import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmPasswordValidator } from '../Validators/confirm-password';
import { UserService } from 'src/app/core';
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {

  @ViewChild('content') content: any;

  form!: FormGroup;
  isSubmit = false;
  isLoading = false;
  error = 0;
  isOldPasswordShow = false;
  isNewPasswordShow = false;
  isConfirmPasswordShow = false;

  constructor(private formBuilder: FormBuilder, private modalService: NgbModal, private router: Router, private userService: UserService) {
    this.create();
  }

  ngOnInit(): void {
  }

  create() {
    this.form = this.formBuilder.group({
      oldPassword: ['', [Validators.required, PasswordValidator.patternValidator()]],
      newPassword: ['', [Validators.required, PasswordValidator.patternValidator()]],
      confirmPassword: ['', [Validators.required, PasswordValidator.patternValidator()]]
    }, {
      validator: ConfirmPasswordValidator('newPassword', 'confirmPassword')
    });
  }

  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    this.isLoading = true;
    this.userService.updatePassword(this.form.value).subscribe((res: any) => {

      if (res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Password Updated' });
        this.isLoading = false;
        this.close();
      }
    }, err => {
      if (err.status === 401) {
        this.f.oldPassword.setErrors({ wrongPassword: err.error.message })
      }
      ;
      this.isLoading = false;
    })
  }

  get f() {
    return this.form.controls;
  }

  onOldPasswordShowHideClick() {
    this.isOldPasswordShow = !this.isOldPasswordShow;
  }
  onNewPasswordShowHideClick() {
    this.isNewPasswordShow = !this.isNewPasswordShow;
  }
  onConfirmPasswordShowHideClick() {
    this.isConfirmPasswordShow = !this.isConfirmPasswordShow;
  }

  open() {
    this.modalService.open(this.content, { size: 'md' });
  }
  close() {
    this.modalService.dismissAll();
    this.form.reset();

  }
  ngOnDestroy() {
  }
}
