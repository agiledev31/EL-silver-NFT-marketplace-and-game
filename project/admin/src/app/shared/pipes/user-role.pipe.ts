import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userRole'
})
export class UserRolePipe implements PipeTransform {
  roles =[{id: 1, name: 'User'},{id: 2, name: 'Super Admin'}, {id: 3, name: 'Admin'} ]
  transform(role): unknown {
    return this.roles.find(e => e.id === role).name;
  }

}
