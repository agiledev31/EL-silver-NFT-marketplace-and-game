import { Pipe, PipeTransform } from '@angular/core';
import { ConstantService } from 'src/app/core';

@Pipe({
  name: 'region'
})
export class RegionPipe implements PipeTransform {

  constructor(private constant: ConstantService) {}
  transform(id: number): string {
    return this.constant.regions.find((e:any )=> e.id == id)?.name;
  }

}
