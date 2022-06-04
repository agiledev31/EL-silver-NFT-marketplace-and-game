import { Component, OnInit } from '@angular/core';
import { UserManagementService } from './../../core/services/user-management.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  filter = {
    query: '',
    status: -1,
    type: -1,

    page: 1,
    limit: 10,

    criteria: -1,
    order:-1
  }
  statuses =[ {id: -1, name: 'All Statuses'},{id: 1, name: 'Active'}, {id: 2, name: 'Inactive'}];
  types= [{id: -1, name: 'All Types'},{id: 1, name: 'User'},{id: 2, name: 'Super Admin'}, {id: 3, name: 'Admin'} ];
  sortstatus = [{ id: -1, name: 'Joining Date' }, { id: 1, name: ' Full Name' }, { id: 2, name: 'Laplata Holding'},];
  sortorder= [{id: -1, name: 'Default'},{id: 1, name: 'Ascending'},];

  isLoader = false;

  result:any="";
  constructor(private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.get();

  }
  get() {
    this.isLoader = true;
    console.log("get called");

    this.userManagementService.list(this.filter).subscribe((res :any)=> {
    this.isLoader = false;
      //console.log('res', res);

      if(res.status === 200) {
        this.result = res.status === 200 ? res.data.result : null;
      }

    }, err => {
      this.isLoader = true;
      this.result = null;
    });
  }

  onStatusAction(status , user , index) {
    this.userManagementService.updateStatus({username: user.username, status}).subscribe((res: any ) => {
      if(res.status === 200) {
        this.result.docs[index].status = status;
      }
    })
  }

  onFilterChange() {
    console.log(this.filter);
    this.get();
  }

  onPageChange(page){
    this.filter.page = page;
    this.get();
  }
}




