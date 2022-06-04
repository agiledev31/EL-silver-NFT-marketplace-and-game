import { Component, OnInit, ViewChild } from '@angular/core';
import { NotificationService } from './../../../core/services/notification.service';
import { UserService } from 'src/app/core';
import { InviteComponent } from 'src/app/shared/invite/invite.component';
import { FiveV5InviteComponent } from './five-v5-invite/five-v5-invite.component';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  @ViewChild(InviteComponent) inviteComponent!: InviteComponent;
  @ViewChild(FiveV5InviteComponent) fiveV5InviteComponent!: FiveV5InviteComponent;

  result:any = null;
  constructor(private notificationService: NotificationService,
    private userService: UserService
    ) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => {
      if(user){
        this.get();
      }
      this.notificationService.getEvent(user._id).subscribe(res => this.get());
      this.notificationService.TournamentInviteEvent(user._id).subscribe(res => this.openInvite(res.tournamentId, res.user));
      this.notificationService.FiveV5InviteEvent(user._id).subscribe(res => this.openInvite(res.tournamentId, res.user));
    })
  }
  get() {
    this.notificationService.getNotification().subscribe(res => {

      if(res.status === 200) {
        this.result = res.data.result;
      }
    }, err => {

    })
  }
  onMarkALLClick() {
    this.notificationService.markAll().subscribe(res => {
      if(res.status === 200) {
       this.get();
      }
    })
  }
  onClickNotification(notification: any){
    // open the notification here
    if(notification.type === 3) {
     this.openInvite(notification.data.tournamentId, notification.user)
    } else if(notification.type === 6) {
      this.open5v5Invite(notification.data.matchRequestId, notification.user)
     }

    this.notificationService.markAsRead(notification._id).subscribe(res => {
      if(res.status === 200) {
       this.get();
      }
    })
  }
  openInvite(tournamentId: any, user: any) {
    this.inviteComponent.id = tournamentId;
    this.inviteComponent.user = user;
    this.inviteComponent.getData();
  }
  open5v5Invite(requestId: any, user: any) {
    this.fiveV5InviteComponent.id = requestId;
    this.fiveV5InviteComponent.user = user;
    this.fiveV5InviteComponent.getData();
    this.fiveV5InviteComponent.open()
  }
}
