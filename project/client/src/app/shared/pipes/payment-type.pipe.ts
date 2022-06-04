import { Pipe, PipeTransform } from '@angular/core';
import { ConstantService } from 'src/app/core';

@Pipe({
  name: 'paymentType'
})
export class PaymentTypePipe implements PipeTransform {

  constructor(private constant: ConstantService) {}
  transform(id: number): string {
    return this.constant.paymentMethods.find((e:any )=> e.id == id)?.name;
  }

}
