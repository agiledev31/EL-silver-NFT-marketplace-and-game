import { Component, OnInit, ViewChild } from '@angular/core';
import { Toast } from 'src/app/_constants/SwalToast';
import { MiningChallengeService } from '../../core/services/miningchallenge.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';

@Component({
  selector: 'app-miningchallenge',
  templateUrl: './miningchallenge.component.html',
  styleUrls: ['./miningchallenge.component.css']
})
export class MiningchallengeComponent implements OnInit {

  miningchallenge:any;
  id = 0;
  data:any;
  remainingEndTime: String = '00:00';
  timerIntervalId: any;
  playTime = 0;
  remainingStartTime: String = '00:00';
  timerIntervalId2: any;
  playTime2 = 0;

  constructor(private MiningChallengeService: MiningChallengeService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
    });
    this.getAllSeries();

  }


  checkEnded() {
    if (moment().valueOf() > moment(this.data?.endDate).valueOf()) {
      return true;
    }
    return false;
  }

  checkStarted() {
    if (moment().valueOf() < moment(this.data?.startDate).valueOf()) {
      return true;
    }
    return false;
  }

  checkRunning() {
    if (!this.checkStarted() &&  moment().valueOf() < moment(this.data?.endDate).valueOf()) {
      return true;
    }
    return false;
  }

  endTimer() {
    const getProgress = () => {
      if (this.playTime > 0) {
        this.playTime = (this.playTime - 1);
        const hours = Math.floor(this.playTime / 3600);
        const minutes = Math.floor((this.playTime - (hours * 3600)) / 60);
        const seconds = (this.playTime - (hours * 3600) - (minutes * 60));
        this.remainingEndTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        clearInterval(this.timerIntervalId);
      }
    };
    this.timerIntervalId = setInterval(getProgress, 1000);
  }

  startTimer() {
    const getProgress2 = () => {
      if (this.playTime2 > 0) {
        this.playTime2 = (this.playTime2 - 1);
        const hours = Math.floor(this.playTime2 / 3600);
        const minutes = Math.floor((this.playTime2 - (hours * 3600)) / 60);
        const seconds = (this.playTime2 - (hours * 3600) - (minutes * 60));
        this.remainingStartTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        clearInterval(this.timerIntervalId2);
      }
    };
    this.timerIntervalId2 = setInterval(getProgress2, 1000);
  }

  getAllSeries() {
    this.MiningChallengeService.getAll().subscribe((res: any) => {
      if (res.status === 200) {
        this.miningchallenge = res.data.docs;
        this.data=this.miningchallenge[this.id];
        const SECONDS_COUNT = moment(this.data?.endDate).diff((moment().unix() * 1000), 'seconds');
        const duration = moment.duration(SECONDS_COUNT, 'seconds');
        this.playTime = duration.asSeconds();
        this.endTimer();

        const SECONDS_COUNT2 = moment(this.data?.startDate).diff((moment().unix() * 1000), 'seconds');
        const duration2 = moment.duration(SECONDS_COUNT2, 'seconds');
        this.playTime2 = duration2.asSeconds();
        this.startTimer();

        // if (moment().valueOf() > moment(this.data?.endDate).valueOf()) {
        //   swal.fire({
        //     title: 'Contest Ended',
        //     text: `The Contest You Are Looking Is Ended, You Can Still Visit The Leaderboard For It`,
        //     icon: 'warning',
        //   })
        // }
      }
    }, err => {
      this.miningchallenge = null;
      Toast.fire({ icon: 'error', title: 'Server Error' });
    })
  }

  ngOnDestroy() {
    clearInterval(this.timerIntervalId);
    clearInterval(this.timerIntervalId2);
  }


}
