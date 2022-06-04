import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { LolChallengeService } from 'src/app/core/services/lolchallenge.service';
import * as _ from "lodash";

@Component({
  selector: 'app-main-slider',
  templateUrl: './main-slider.component.html',
  styleUrls: ['./main-slider.component.css'],
})
export class MainSliderComponent implements OnInit, OnDestroy {
  header = true;
  headerGrey = false;
  isAuth = true;
  isLogin = false;
  isSign = false;
  userHeaderService: Subscription = new Subscription();
  currentUser = null;
  page = 1;
  query = {
    status: -1,
    sortstatus: -1,
  };
  statistics = {
    totalChallenges: 1000,
    totalGamesPlayed: 1500,
    totalDailyChallenges: 300,
    totalDailyGamesPlayed: 450,
    releasedLaplata: 1280,
    ongoingChallenges: 45,
    totalminers: 125,
  };
  laplataSettings={
    perDayDistribution:8,
    incentive:25,
  }

  public isMenuCollapsed = true;

  constructor(
    config: NgbCarouselConfig,
    private router: Router,
    private userService: UserService,
    private lolChallengeService: LolChallengeService
  ) {
    config.interval = 11000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
    this.userHeaderService = this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData as any;
      }
    );
    router.events.subscribe((e) => {
      this.isAuth = router.url.includes('auth');
      this.isLogin = router.url.includes('auth/login');
      this.isSign = router.url.includes('auth/signup');

      if (router.url == '/') {
        this.header = true;
        this.headerGrey = false;
      } else if (router.url.includes('auth')) {
        this.header = false;
        this.headerGrey = false;
      } else {
        this.header = false;
        this.headerGrey = true;
      }
    });
  }

  ngOnInit(): void {
    this.getAllChallenges(this.page, this.query);
    if (sessionStorage.getItem('laplatasettings') !== null)
    {
      const settings = sessionStorage.getItem('laplatasettings');
      this.laplataSettings = JSON.parse(settings || '{}');
    }
    else
    {
      this.lolChallengeService.getlaplatastats()
        .subscribe(response => {
          console.log("getlaplata", response.data[0]);
          sessionStorage.setItem('laplatasettings', JSON.stringify(response.data[0]));
        });
    }

  }

  getAllChallenges(page?: any, query?: any) {

    this.lolChallengeService.getAllChallenges({ page: page, sortstatus: query.sortstatus, time: query.status })
      .subscribe(response => {
          this.statistics = _.get(response, "data.statistics");
      });
  }

  onLogoutClick() {
    this.userService.purgeAuth();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy() {
    this.userHeaderService.unsubscribe();
  }
}
