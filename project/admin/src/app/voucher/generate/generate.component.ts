import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { UserManagementService } from 'src/app/core/services/user-management.service';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { Toast } from 'src/app/_constants/SwalToast';
import { VoucherService } from './../../core/services/voucher.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.component.html',
  styleUrls: ['./generate.component.css']
})
export class GenerateComponent implements OnInit {

  id = null;

  form: FormGroup;
  isSubmit = false;
  constructor(private router: Router, private route: ActivatedRoute ,private formBuilder:FormBuilder, private voucherService:VoucherService ) {
    this.route.params.subscribe(params => {
      this.id = params['id'];
      if(this.id) {
        this.get();
      }
    })
  }
  get() {
    this.voucherService.getById(this.id).subscribe(
      res => {
        this.form.patchValue(res.data.voucher);
        this.f.validThru.patchValue(new Date(res.data.voucher.validThru))
        this.f.silver.disable();
        this.f.voucherCode.disable();
      },
       err =>  Toast.fire({ icon: 'error', title: 'Something is wrong' }))
  }
  ngOnInit(): void {
    this.create()
  }
  create() {
    this.form = this.formBuilder.group({
      silver: [0, [Validators.min(1),Validators.required]],
      validThru: ['', [Validators.required,]],
      voucherCode: ['', ]
    });
  }
  get f() { return this.form.controls; }
  onSubmit() {
    this.isSubmit = true;
    if (this.form.invalid) {  return; }
    let sub = null;
    if(this.id){
      sub = this.voucherService.update(this.id, this.form.value);
    } else {
      sub = this.voucherService.create(this.form.value);
    }
    sub.subscribe((res: any) => {
      if(res.status === 200) {
        Toast.fire({ icon: 'success', title: 'Voucher Added' });
        this.router.navigate(['/voucher']);
      }
    }, err=> {
      Toast.fire({ icon: 'error', title: 'Something is wrong' });

    })
  }

}
