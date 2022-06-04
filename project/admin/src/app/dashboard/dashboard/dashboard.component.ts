import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  form: FormGroup;
  todayUser = "";
  weeklyUser = "";
  monthlyUser = "";
  formDate = '';
  detail;
  filteredUserGrowth = "";
  startDateModel: NgbDate;
  endDateModel: NgbDate;
  startDate: NgbDate | null;
  endDate: NgbDate | null;
  constructor(private userService: UserService, private calendar: NgbCalendar, public formatter: NgbDateParserFormatter) {
    let now = new Date();
    const year: number = now.getFullYear();
    const month: number = now.getMonth();
    const day: number = now.getDate();
    const day1: number = new Date(year, month, day).getDate();
    this.startDate = new NgbDate(year, month, day1);
    this.endDate = calendar.getToday()
  }

  ngOnInit(): void {
    this.userGrowth();
    this.form = new FormGroup({
      startDate: new FormControl(null, [Validators.required]),
      endDate: new FormControl(null, [Validators.required])
    });
    this.checkDate();
  }


  onStartDateSelect(event: NgbDate) {
    this.startDate = event;
  }

  onEndDateSelect(event: NgbDate) {
    this.endDate = event;
  }

  checkDate() {
    if (this.startDate && this.endDate) {
      this.userGrowth();
    }
  }

  userGrowth() {
    let dateFilter = {
      startDate: moment(this.formatter.format(this.startDate)).format('MM/DD/YYYY'),
      endDate: moment(this.formatter.format(this.endDate)).format('MM/DD/YYYY')
    }
    this.userService.userGrowth(dateFilter).subscribe((res: any) => {
      if (res.status === 200) {
        this.detail = res.data;
        this.todayUser = res.data.dailyUserGrowth;
        this.weeklyUser = res.data.weeklyUserGrowth;
        this.monthlyUser = res.data.monthlyUserGrowth;
        this.filteredUserGrowth = res.data.filterUserGrowth;
      }
    },
    )
  }

  onDateSelection(date: NgbDate) {
    if (!this.startDate && !this.endDate) {
      this.startDate = date;
    } else if (this.startDate && !this.endDate && date && date.after(this.startDate)) {
      this.endDate = date;
    } else {
      this.endDate = null;
      this.startDate = date;
    }
  }

  onSubmit() {
    // this.userGrowth();
  }
}





