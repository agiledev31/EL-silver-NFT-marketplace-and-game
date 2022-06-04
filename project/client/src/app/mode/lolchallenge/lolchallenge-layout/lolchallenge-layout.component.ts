import { Component, OnInit, OnDestroy } from '@angular/core';
import { LolChallengeService } from '../../../core/services/lolchallenge.service';
import { ConstantService, UserService } from 'src/app/core';
import { SocketService } from 'src/app/core';
import { interval, Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-lolchallenge-layout',
  templateUrl: './lolchallenge-layout.component.html',
  styleUrls: ['./lolchallenge-layout.component.css']
})
export class LolChallengeLayoutComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  statistics: any;
  result: any = [];
  announcments: any;
  mylaplatasettings: any = {};
  hideNotifications: any = false;
  userHeaderService: Subscription = new Subscription();
  announcementsService: Subscription = new Subscription();
  announcmentsDescription: any;
  description: any;

  constructor(private lolChallengeService: LolChallengeService, private userService: UserService, private socketService: SocketService, private modalService: NgbModal) {

    if (sessionStorage.getItem("authdata") !== null) {
      let authArray = sessionStorage.getItem("authdata");
      this.currentUser = JSON.parse(authArray || '{}');
      console.log("in layout constructor");
    }
    else {
      this.userHeaderService = this.userService.currentUser.subscribe(
        (userData) => {
          this.currentUser = userData as any;
        }
      )
    }
  }

  ngOnInit(): void {

    if (this.currentUser) {
      this.parentFun();
    }
    this.getlaplatastats();
    this.getData();
    this.getAnnouncements()
  }

  parentFun() {
    this.getStatistics();
  }

  getlaplatastats(): void {
    this.lolChallengeService.getlaplatastats().subscribe((res: any) => {
      this.mylaplatasettings = res.data[0];
      console.log("laplatasettings", this.mylaplatasettings);
    })

  }


  getAnnouncements(): void {
    this.socketService.onEvent('Announcements').subscribe(e => {
      this.getData();
    })
  }

  getData() {
    this.announcementsService.unsubscribe();
    this.lolChallengeService.getAnnouncements().subscribe((res: any) => {
      if (res.status === 200) {
        this.result = res.status === 200 ? res.data.result : null;
        if (this.result && this.result.docs.length > 0) {
          this.announcmentsFunction();
        }
      }
    }, err => {
      this.result = null;
    });
  }

  announcmentsFunction() {
    const source = interval(2000);
    this.announcementsService = source.subscribe(val => {
      let current;
      if (val < this.result.docs.length) {
        current = this.result.docs[val];  // Asign i as vector of arr and put in a variable 'current';
        this.announcments = current.title;
        this.announcmentsDescription = current.description ? current.description : null;
      } else {
        this.announcementsService.unsubscribe();
        this.announcmentsFunction();
      }
    })
  }

  getStatistics(): void {
    this.lolChallengeService.getStatistics().subscribe((res: any) => {
      this.statistics = res.data;
    });
  }

  ngOnDestroy() {
    this.userHeaderService.unsubscribe();
  }


  /**
  * 
  * @param description 
  * @param content 
  */
  OnViewClick(description: any, content: any) {
    this.description = description;
    this.modalService.open(content);
  }

  hideAnnoucements() {
    this.hideNotifications = true;
  }
}
