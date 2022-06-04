import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PlayerTypeIcon'
})
export class TypeIconPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) { return "assets/images/top-position1.svg"; }
    if (value === 2) { return "assets/images/top-position3.svg"; }
    if (value === 3) { return "assets/images/top-position4.svg"; }
    if (value === 4) { return "assets/images/top-position5.svg"; }
    if (value === 5) { return "assets/images/top-position2.svg"; }
  }
}


