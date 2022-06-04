import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userStatus'
})
export class UserStatusPipe implements PipeTransform {

  statuses = [{id: 1, name: 'Active'}, {id: 2, name: 'Inactive'}]
  transform(status): unknown {
    return this.statuses.find(e => e.id == status).name;
  }

}
