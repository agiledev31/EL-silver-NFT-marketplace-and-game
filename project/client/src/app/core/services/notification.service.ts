import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private socketService: SocketService,
    private apiService: ApiService,
    ) {}

  getEvent(userId: string){
    return this.socketService.onEvent('notification'+userId);
  }
  TournamentInviteEvent(userId: string){
    return this.socketService.onEvent('TournamentInvite'+userId);
  }
  FiveV5InviteEvent(userId: string){
    return this.socketService.onEvent('5V5Invite'+userId);
  }
  getNotification() { return this.apiService.get(`/notification`,);  }
  markAll(){ return this.apiService.get(`/notification/mark-all`,);  }
  markAsRead(notificationId: string){ return this.apiService.get(`/notification/mark-as-read/${notificationId}`,);  }
}
