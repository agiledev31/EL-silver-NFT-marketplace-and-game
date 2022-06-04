import { Injectable } from '@angular/core';
import { ApiService, SocketService } from '../core';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private apiService: ApiService,
    private socketService: SocketService,
    ) {
   }
  sendMessage(msg: any){return this.apiService.post(`/chat`, msg);}

  getFriends() {return this.apiService.get('/user/friends');}
  getHistoryAndUser(id: any, params: any) {return this.apiService.get(`/chat/${id}?${params}`);}
  getChatUsers() {return this.apiService.get(`/chat/users`);}

  getConversationEvent(currentUserId: string){ return this.socketService.onEvent('conversation'+currentUserId); }


}
