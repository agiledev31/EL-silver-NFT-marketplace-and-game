import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'silverPrice'
})
export class SilverPricePipe implements PipeTransform {

  transform(price: number, type: number): unknown {
    return type == 1 ? price.toFixed(2) :  (price/ 31).toFixed(2);
  }

}
