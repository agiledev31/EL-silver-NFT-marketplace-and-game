import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConstantService, TradeService } from 'src/app/core';
import { Toast } from './../../../_constants/SwalToast';


@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit {
  form!:FormGroup;
  isSubmit = false;
  constructor(private formBuilder:FormBuilder, public constant: ConstantService, private tradeService:  TradeService, private router: Router) { }

  ngOnInit(): void {
    this.create();
  }
  create() {
    this.form = this.formBuilder.group({
      type: [1, [Validators.required]],
      amount:['', [Validators.required]],
      margin:['', [Validators.required]],
      country: [0, [Validators.required]],
      paymentMethod: [0,[Validators.required]],
      description: ['', [Validators.required]]
    });
  }
  get f() {return this.form.controls;}
  onSubmit() {
    this.isSubmit = true;
    if(this.form.invalid) {return;}
    this.tradeService.createP2PPost(this.form.value).subscribe(res => {
      if(res.status === 200) {
        let route = this.f.type.value === 1 ? '': '/trade/p2p/sell/1';
        this.router.navigate(['/trade/p2p/'],{ queryParams: { trade: this.f.type.value === 1 ? 'manage-buy': 'manage-sell' } });
        // alert heres
      }
    } , err => {
      Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' })
      
    })
  }
}
