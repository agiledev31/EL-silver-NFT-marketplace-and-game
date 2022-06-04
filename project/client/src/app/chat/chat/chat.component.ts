import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  isNoFriends = false;
  constructor(private chatService: ChatService,) {
  }

  ngOnInit(): void {
  }

  onNoFriends(isNoFriends: boolean) {
    this.isNoFriends = isNoFriends;
  }

}
