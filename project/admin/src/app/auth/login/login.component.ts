import { Component, ElementRef, OnInit, TemplateRef, ViewChild,OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PasswordValidator } from 'src/app/shared/Validators/password-validator';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  closeResult = '';
  form: FormGroup;
  isSubmit = false;
  error = 0;
  userLoginEmail: Subscription = new Subscription();

  @ViewChild('content') content: ElementRef;
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.create();
  }
  create(){
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        PasswordValidator.patternValidator() ]]
    });
  }
  get f() {return this.form.controls; }

  onSubmit() {
    this.error = 0;
    this.isSubmit = true;
    if(this.form.invalid) {return; }
    this.userLoginEmail = this.userService.loginEmail(this.form.value).subscribe((res: any) => {
      if(res.status === 200) {
        this.userService.setAuth(res.data.user);
        this.router.navigate(['/dashboard']);
      }
    }, err=> {
      if(err.status === 401 && err.error.code === 401.1) {
        this.open();
      } else if(err.status === 401) {this.error = 1;}
    })
  }


  open(){
    this.modalService.open(this.content, {size: 'sm'})
  }

  ngOnDestroy() {
    this.userLoginEmail.unsubscribe();
  }

}
