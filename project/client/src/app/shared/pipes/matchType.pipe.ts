import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'MatchType'
})
export class MatchTypePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) { return "Solo Mode"; }
    if (value === 2) { return "5v5 Mode"; }
  }

}
