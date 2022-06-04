import { Component, OnDestroy, OnInit, AfterContentInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { ConstantService, UserService } from 'src/app/core';
import { Subscription } from 'rxjs';
import { ClaimRewardComponent } from '../claim-reward/claim-reward.component';
import { DatePipe } from '@angular/common';
import { Toast } from 'src/app/_constants/SwalToast';
import { LolChallengeService } from 'src/app/core/services/lolchallenge.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import swal from 'sweetalert2';
import axios from 'axios';
import { environment } from './../../../../environments/environment'
import { Web3Service } from 'src/app/core/services/web3.service'

declare var $: any;
@Component({
  selector: 'app-lolchallenge',
  templateUrl: './lolchallenge.component.html',
  styleUrls: ['./lolchallenge.component.css'],
  providers: [
    DatePipe
  ]
})

export class LolChallengeComponent implements OnInit, OnDestroy {
  @Input() mylaplatasettings: any;

  Timeout = setInterval(() => { }, 0).constructor;
  form: FormGroup;
  currentUser: any = null;
  clientId = '';
  country = '';
  flag = 0;

  challenge: any;
  gameData: any[] = [];
  gameStatistics: any = {
    total: 0,
    averageKDA: 0,
    victories: 0,
    defeats: 0,
    startTime: null,
    endTime: null
  };

  isLoading = false;
  isSubmit = false;
  playTime = 0;

  timerIntervalId: any;
  repeatRefresh: any;

  isChallengeStarted = false;
  startChallenge = false;
  moment = moment;
  rewardedLaplata = 0;
  minutes = 1440;
  remainingTime: String = '00:00';
  challengeStartTime: any;
  challengeEndTime: any;
  rewardAvailable = false;
  runningChallengeID = '';
  nextChallengeTime: any;
  canUserParticipateInNextChallenge = true;
  nextChallengeRemainingTime: any;
  refreshLoader = false;
  lastRefreshTime = new Date();
  isLol_id_Engaged: any = 0;
  faketime: boolean = false;

  checkiftimer = true;
  totalMiningRate: any = 0
  
  userHeaderService: Subscription = new Subscription();
  @ViewChild(ClaimRewardComponent) claimRewardComponent!: ClaimRewardComponent;

  constructor(public web3Service: Web3Service, private formBuilder: FormBuilder, public constant: ConstantService, private userService: UserService, private lolChallengeService: LolChallengeService, private router: Router) {

    this.form = this.formBuilder.group({
      clientId: ['', [Validators.required, Validators.minLength(1),]],
      country: '',
    });

    if (sessionStorage.getItem('authdata') !== null) {
      const authArray = sessionStorage.getItem('authdata');
      this.currentUser = JSON.parse(authArray || '{}');
      console.log('in lolchallenge constructor');
    }
    else {
      this.userHeaderService = this.userService.currentUser.subscribe(
        (userData) => {
          this.currentUser = userData as any;
        }
      );
    }
  }

  ngOnInit() {

    if (this.currentUser != null) {

      if (localStorage.getItem('playerdetails') !== null) {
        const storedArray = localStorage.getItem('playerdetails');
        const x = JSON.parse(storedArray || '{}');
        this.form.setValue({
          clientId: x[0],
          country: x[1],
        });
      }

      this.unRewardedSession();
      this.fetchRunningChallenge();
    }
    else {
      console.log('no auth');
    }

    this.getTotalMiningRate()
  }

  async getTotalMiningRate(){
    await this.web3Service.beforeProgressing();
    debugger
    let result = await this.web3Service.fetchUserInventory(
      this.web3Service.getConnectedAccount()
    );
    this.totalMiningRate = result.totalRate;
  }

  onstart() {
    this.fetchRunningChallenge();
    if (this.flag == 0) {
      this.onStartChallenge();
      // this.refreshGame();
    }
  }

  onend() {

    // this.refreshGameEnd()
    // this.fetchRunningChallenge();
    this.onEndChallenge();

  }

  fetchRunningChallenge() {

    this.lolChallengeService.fetchRunningChallenge().subscribe((res: any) => {

      if (res.status == 200 && !_.isEmpty(res.data)) {

        this.challenge = res.data;
        this.runningChallengeID = this.challenge._id;
        this.create();

        if (localStorage.getItem('refreshstats') !== null) {
          this.lastRefreshTime = JSON.parse(localStorage.getItem('refreshstats') || '{}');
        }

        if (this.checkiftimer) {
          console.log('timerstarted');
          this.startTimer();
        }
        this.flag = 1;
        this.challengeStartTime = moment(res.data.gameStatistics.startTime).valueOf();
        this.challengeEndTime = moment(res.data.gameStatistics.endTime).valueOf();

        const storedArray = sessionStorage.getItem('gameDatastats');
        this.gameData = JSON.parse(storedArray || '{}');
        const storedArray1 = sessionStorage.getItem('challengestats');
        this.gameStatistics = JSON.parse(storedArray1 || '{}');
        this.gameStatistics.startTime = res.data.gameStatistics.startTime;

        const now = (moment().unix() * 1000);
        this.isChallengeStarted = true;

        if (this.challengeEndTime >= now) {
          const SECONDS_COUNT = moment(this.challengeEndTime).diff(now, 'seconds');
          const duration = moment.duration(SECONDS_COUNT, 'seconds');
          this.playTime = duration.asSeconds();
          this.canUserParticipateInNextChallenge = false;
        }
      }
    });
  }

  unRewardedSession() {

    this.lolChallengeService.fetchRunningChallenge().subscribe((res: any) => {

      if (res.status == 200 && !_.isEmpty(res.data)) {

        this.challenge = res.data;
        this.runningChallengeID = this.challenge._id;
        if (moment(this.challenge.gameStatistics.endTime).valueOf() < moment().valueOf()) {

          const NOW = (moment().unix() * 1000);
          const SECONDS_COUNT = moment(NOW).diff(this.challenge.gameStatistics.startTime, 'minutes');
          const DURATION = moment.duration(SECONDS_COUNT, 'minutes');
          let difftime;
          if (this.faketime) {
            difftime = 14400;
          }
          else {
            difftime = DURATION.asMinutes();
          }


          this.lolChallengeService.getGameData(res.data.clientId, res.data.region, difftime).subscribe((resp: any) => {
            console.log('gamedata', resp.data.results);
            const mygamedata = resp.data.results;

            this.gameStatistics = res.data.gameStatistics;
            this.gameData = mygamedata.filter(function (product: any) {
              let date = new Date(product.timestamp * 1000);
              console.log(date, new Date(res.data.gameStatistics.startTime), new Date(res.data.gameStatistics.endTime));

              return (date >= new Date(res.data.gameStatistics.startTime) && date <= new Date(res.data.gameStatistics.endTime));
            });

            console.log(this.gameData);
            this.gameStatistics.averageKDA = this.gameData.reduce(function (avg, { KDA }, _, { length }) {
              if (KDA === 'Perfect') {
                KDA = '30';
              }
              return (avg + KDA / length);
            }, 0);

            this.gameStatistics.total = this.gameData.length;
            this.gameStatistics.defeats = this.gameData.filter(x => x.result == 'Defeat').length;
            this.gameStatistics.victories = this.gameData.filter(x => x.result == 'Victory').length;

            localStorage.setItem('playerdetails', JSON.stringify([res.data.clientId, res.data.region]));
          });

          swal.fire({
            title: 'Auto Collecting Reward for Last Session',
            text: `It seems like you didn't ended the challenge in the last session`,
            icon: 'warning',
            showConfirmButton: false,
            timer: 3000
          })
            .then(
              () => {
                this.lolChallengeService.endChallenge(this.runningChallengeID, { clientId: res.data.clientId, country: res.data.region, gameStatistics: this.gameStatistics, games: this.gameData, isFinished: true })
                  .subscribe((res: any) => {
                    swal.fire({
                      title: 'Congratulations',
                      text: `The reward has been deposited to your account for this challenge`,
                      icon: 'success',
                    }).then(
                      () => {
                        location.reload();
                      }
                    );
                  });
              }
            );

          return;
        }


      }

    });

  }


  get f() {
    return this.form.controls;
  }

  // Creates form
  create() {
    this.form = this.formBuilder.group({
      clientId: [_.get(this.challenge, 'clientId'), [Validators.required, noWhitespaceValidator]],
      country: [_.get(this.challenge, 'region'), [Validators.required]]
    });
  }


  // Called when we start the challenge
  async onStartChallenge() {

    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }

    // fetch if user is engaged
    console.log('checking if challenge is already started', this.isChallengeStarted);
    if (this.isChallengeStarted) {
      return;
    }

    Toast.fire({ icon: 'info', titleText: 'Validating LOL ID please wait....' });
    if (this.form.value.clientId.length != 0 && this.form.value.country.length != 0) {
      const checkUserActiveonLOL = await axios.get(`${environment.external_api_url}load_username?username=${encodeURIComponent(this.form.value.clientId)}&region=${encodeURIComponent(this.form.value.country)}&minutes=${encodeURIComponent(525600)}`).then(response => response.data.data.count);
      // console.log("Called when we start the challenge", checkUserActiveonLOL);
      if (checkUserActiveonLOL != 0) {

        const resp = await this.lolChallengeService.fetchIfEngagedinChallenge(this.form.value.clientId, this.form.value.country).toPromise();
        this.isLol_id_Engaged = resp.data.challenge;
        console.log(this.isLol_id_Engaged);

        if (this.isLol_id_Engaged == 0) {
          Toast.fire({ icon: 'success', titleText: 'ClientID found starting challenge' });
          this.isLoading = true;
          this.clientId = this.form.value.clientId;
          this.country = this.form.value.country;
          this.startChallenge = true;
          this.rewardAvailable = false;
          this.rewardedLaplata = 0;
          this.gameStatistics = {
            total: 0,
            averageKDA: 0,
            victories: 0,
            defeats: 0,
            startTime: Date.now(),
          };
          this.createChallengeindb();
        } else {
          swal.fire({
            title: 'This LoL ID is already assigned with another challenge',
            text: `Please check spelling. And if you are sure then please contact Administrator!`,
            icon: 'error',
            showCancelButton: false,
            confirmButtonText: 'Go Back',
          });
        }
      } else {
        swal.fire({
          title: 'This summoner is not registered',
          text: `Please check spelling.Did you select the right server? Try searching for the summoner in another region`,
          icon: 'error',
          showCancelButton: false,
          confirmButtonText: 'Go Back',
        });
      }
    } else {
      Toast.fire({ icon: 'error', titleText: 'Please select a Region' });
    }

  }

  createChallengeindb() {
    this.lolChallengeService.createNewChallenge(this.clientId, this.country,).subscribe((res: any) => {
      // this.fetchRunningChallenge();
      this.refreshGame();
    });
  }

  refreshGame() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }
    // re-assign value
    this.clientId = this.form.value.clientId;
    this.country = this.form.value.country;

    const NOW = (moment().unix() * 1000);
    const SECONDS_COUNT = moment(NOW).diff(this.challengeStartTime, 'minutes');
    const DURATION = moment.duration(SECONDS_COUNT, 'minutes');

    if (this.faketime) {
      this.minutes = 14400;
    }
    else {
      this.minutes = DURATION.asMinutes();
    }

    this.refreshLoader = true;
    this.lolChallengeService.getGameData(this.clientId, this.country, this.minutes,).subscribe((res: any) => {
      this.isLoading = false;
      this.refreshLoader = false;
      if (res.status === 200) {
        this.lastRefreshTime = new Date();
        localStorage.setItem('refreshstats', JSON.stringify(this.lastRefreshTime));
        if (this.startChallenge) {
          this.isChallengeStarted = true;
          this.canUserParticipateInNextChallenge = false;
          this.fetchRunningChallenge();
        }
        this.startChallenge = false;
        this.gameData = _.get(res, 'data.results', []);
        this.gameStatistics.total = this.gameData.length;
        this.gameData.forEach(element => {
          element.date = new Date(element.timestamp * 1000);
          element.time = this.time_ago(new Date(element.timestamp * 1000));
        });
        this.gameStatistics.averageKDA = this.gameData.reduce(function (avg, { KDA }, _, { length }) {
          if (KDA === 'Perfect') {
            KDA = '30';
          }
          return (avg + KDA / length);
        }, 0);

        sessionStorage.setItem('gameDatastats', JSON.stringify(this.gameData));

        this.gameStatistics.defeats = this.gameData.filter(x => x.result == 'Defeat').length;
        this.gameStatistics.victories = this.gameData.filter(x => x.result == 'Victory').length;
        this.gameStatistics.endTime = moment().unix() * 1000;
        sessionStorage.setItem('challengestats', JSON.stringify(this.gameStatistics));
      }
    }, err => {

      this.isLoading = false;
    });
  }

  refreshGameEnd() {
    this.isSubmit = true;
    if (this.form.invalid) {
      return;
    }

    const NOW = (moment().unix() * 1000);
    const SECONDS_COUNT = moment(NOW).diff(this.challengeStartTime, 'minutes');
    const DURATION = moment.duration(SECONDS_COUNT, 'minutes');
    if (this.faketime) {
      this.minutes = 14400;
    }
    else {
      this.minutes = DURATION.asMinutes();
    }

    this.refreshLoader = true;
    this.lolChallengeService.getGameData(this.clientId, this.country, this.minutes,).subscribe((res: any) => {
      this.isLoading = false;
      this.refreshLoader = false;
      if (res.status === 200) {
        this.lastRefreshTime = new Date();
        localStorage.setItem('refreshstats', JSON.stringify(this.lastRefreshTime));

        this.startChallenge = false;
        this.gameData = _.get(res, 'data.results', []);
        this.gameStatistics.total = this.gameData.length;
        this.gameData.forEach(element => {
          element.date = new Date(element.timestamp * 1000);
          element.time = this.time_ago(new Date(element.timestamp * 1000));
        });
        this.gameStatistics.averageKDA = this.gameData.reduce(function (avg, { KDA }, _, { length }) {
          if (KDA === 'Perfect') {
            KDA = '30';
          }
          return (avg + KDA / length);
        }, 0);

        this.gameStatistics.defeats = this.gameData.filter(x => x.result == 'Defeat').length;
        this.gameStatistics.victories = this.gameData.filter(x => x.result == 'Victory').length;
        this.gameStatistics.endTime = moment().unix() * 1000;
        this.fetchRunningChallenge();
      }
    }, err => {

      this.isLoading = false;
    });
  }


  // Ends and submits a challenge
  onEndChallenge() {
    this.isLoading = true;
    localStorage.setItem('playerdetails', JSON.stringify([this.clientId, this.country]));
    swal.fire({
      title: 'Are you sure you want to End Challenge?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    })

      .then(async (willDelete) => {
        if (willDelete.isConfirmed) {

          this.refreshGameEnd();

          // check if the challenge really exist or has been already ended from another session
          const resp = await this.lolChallengeService.fetchIfEngagedinChallenge(this.form.value.clientId, this.form.value.country).toPromise();
          this.isLol_id_Engaged = resp.data.challenge;

          console.log('all is well', this.isLol_id_Engaged);
          if (this.isLol_id_Engaged == 0) {
            // Toast.fire('The Challenges you are trying to access was already closed in another session');
            await swal.fire({
              title: 'Challenge Already Ended',
              text: `The Challenge you are trying to access is already ended in another session`,
              icon: 'error',
            });
            sessionStorage.removeItem('gameDatastats');
            sessionStorage.removeItem('challengestats');
            localStorage.removeItem('refreshstats');
            location.reload();
            return;
          }

          console.log(this.gameStatistics);
          this.lolChallengeService.endChallenge(this.runningChallengeID, { clientId: this.clientId, country: this.country, gameStatistics: this.gameStatistics, games: this.gameData, isFinished: true })
            .subscribe((res: any) => {
              this.isLoading = false;
              if (res.status === 200) {
                this.rewardAvailable = true;
                this.rewardedLaplata = _.get(res, 'data.rewardedLaplata');
                Toast.fire({ icon: 'success', titleText: 'Request confirmed' });
                this.isChallengeStarted = false;
                this.gameStatistics = {
                  total: 0,
                  averageKDA: 0,
                  victories: 0,
                  defeats: 0,
                  startTime: null,
                  endTime: null
                };
                sessionStorage.removeItem('gameDatastats');
                sessionStorage.removeItem('challengestats');
                localStorage.removeItem('refreshstats');
                this.flag = 0;
                this.nextChallengeTime = moment(res.data.updatedAt).add(6, 'hours').format('h:mm:ss a');
                this.checkUserParticipation();
                this.stopInterval(this.timerIntervalId);
              }
            }, (err: any) => {
              this.isLoading = false;
              Toast.fire({ icon: 'error', title: 'Whoops! Something went Wrong', text: 'please try again later' });
              console.log('err', err);
            });
        }
      });
  }

  checkUserParticipation() {
    setInterval(() => {
      const currentTime = moment(new Date()).format('h:mm:ss a');
      if (this.nextChallengeTime === currentTime) {
        this.canUserParticipateInNextChallenge = true;
      }
      this.nextChallengeRemainingTime = moment(this.nextChallengeTime, 'hh:mm:ss a').fromNow(true);
    }, 1000);
  }



  // Claims reward
  claimReward() {
    this.claimRewardComponent.open();
  }

  rewardClaimed(e: boolean) {
    this.rewardAvailable = !e;
  }

  // Runs the timer for the game
  startTimer() {
    const getProgress = () => {
      if (this.playTime > 0) {
        this.playTime = (this.playTime - 1);
        const hours = Math.floor(this.playTime / 3600);
        const minutes = Math.floor((this.playTime - (hours * 3600)) / 60);
        const seconds = (this.playTime - (hours * 3600) - (minutes * 60));
        this.remainingTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.checkiftimer = false;
      } else {
        clearInterval(this.timerIntervalId);
        this.checkiftimer = true;
      }
    };
    const repeat15 = () => {
      this.refreshGame();
    };
    this.timerIntervalId = setInterval(getProgress, 1000);
    // this.repeatRefresh = setInterval(repeat15, 600000)
  }


  formatTime(time: any) {
    return moment(time).fromNow();
  }
  // Helper function to get time ago syntax
  time_ago(time: any) {
    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) { time = time.getTime(); }
        break;
      default:
        time = +new Date();
    }
    let time_formats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000] // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - time) / 1000,
      token = 'ago',
      list_choice = 1;

    if (seconds == 0) {
      return 'Just now';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      list_choice = 2;
    }
    let i = 0,
      format;
    while (format = time_formats[i++]) {
      if (seconds < format[0]) {
        if (typeof format[2] == 'string') {
          return format[list_choice];
        }
        else {
          return Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token;
        }
      }
    }
    return time;
  }

  stopInterval(intervalId: any) {
    clearInterval(intervalId);
    this.checkiftimer = true;
  }

  ngOnDestroy() {
    this.userHeaderService.unsubscribe();
    clearInterval(this.timerIntervalId);
  }

}
