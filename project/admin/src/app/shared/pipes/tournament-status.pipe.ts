import { Pipe, PipeTransform } from '@angular/core';
import { ConstantService } from 'src/app/core/services/constant.service';

@Pipe({
  name: 'tournamentStatus'
})
export class TournamentStatusPipe implements PipeTransform {

  constructor(private constService: ConstantService) { }

  transform(tournamentStatusId): any {
    const name = this.constService.tournamentStatus.find(element => element.id == tournamentStatusId).name;
    return name ? name : "null";
  }

}
