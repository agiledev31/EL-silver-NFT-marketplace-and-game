import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerLevel'
})
export class PlayerLevelPipe implements PipeTransform {

  transform(points: number): number {
    return 3;
  }

}
