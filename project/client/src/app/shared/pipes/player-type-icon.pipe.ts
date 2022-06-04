import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'playerTypeIcon'
})
export class PlayerTypeIconPipe implements PipeTransform {
  playerTypes = [{id:1, icon:'assets/images/top-position1.svg'},{id:2, icon:'assets/images/top-position2.svg'}, {id:3, icon:'assets/images/top-position3.svg'}, {id:4, icon:'assets/images/top-position4.svg'}, {id:5, icon:'assets/images/top-position5.svg'}];
  transform(playerType: number): unknown {
    return this.playerTypes.find(e => e.id === playerType)?.icon;
  }

}
