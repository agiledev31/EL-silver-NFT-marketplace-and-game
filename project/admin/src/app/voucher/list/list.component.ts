import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { VoucherService } from 'src/app/core/services/voucher.service';
import { Toast } from 'src/app/_constants/SwalToast';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  page = 1;
  limit = 10;

  isLoader = false;

  result = null;
  constructor(private voucherService: VoucherService) { }

  ngOnInit(): void {
    this.get();
  }
  get() {
    this.isLoader = true;
    this.voucherService.getAll(this.page, this.limit).subscribe((res :any)=> {
    this.isLoader = false;
      if(res.status === 200) {
        this.result = res.status === 200 ? res.data.result : null;
      }

    }, err => {
      this.isLoader = false;
      this.result = null;
    });
  }

  onDeleteClick(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.voucherService.delete(id).subscribe((res: any ) => {
          if(res.status === 200) {
            this.get();
            Toast.fire({ icon: 'success', title: 'Voucher Delete' });
          }
        }, err => Toast.fire({ icon: 'error', title: 'Whoop Something is wrong', text: 'please try again later' }))
      }
    })

  }

  onFilterChange() {
    this.get();
  }

  onPageChange(page){
    this.page = page;
    this.get();
  }

  isActive(d) {
    return moment(d).diff(moment.now()) > 0;
  }
}




