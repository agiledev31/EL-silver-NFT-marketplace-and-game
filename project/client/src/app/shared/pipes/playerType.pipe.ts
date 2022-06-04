import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'PlayerType'
})
export class PlayerTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    // 1: Top , 2: Mid , 3:Add Carry, 4: Jungle, 5: Support
    if (value === 1) { return "Top"; }
    if (value === 2) { return "Mid"; }
    if (value === 3) { return "Add Carry"; }
    if (value === 4) { return "Jungle"; }
    if (value === 5) { return "Support"; }
    else { return "NaN"; }
  }

}
