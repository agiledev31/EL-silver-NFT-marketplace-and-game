import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {
  countries :any = null;
  regions :any = null;
  paymentMethods :any = null;
  system: any = null;
  constructor(private apiService: ApiService) { }
  populate(){
    this.apiService.get('/constants').subscribe(res => {
      if(res.status === 200) {
        this.countries = res.data.countries;
        this.regions = res.data.regions;
        this.paymentMethods = res.data.paymentMethods;
        this.system = res.data.system;
      }
    })
  }
}
