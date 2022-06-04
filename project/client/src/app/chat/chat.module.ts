import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component';
import { UsersListComponent } from './users-list/users-list.component';
import { ConversationComponent } from './conversation/conversation.component';
import { SharedModule } from '../shared/shared.module';
import { ChatRoutingModule } from './chat-routing.module';



@NgModule({
  declarations: [ChatComponent, UsersListComponent, ConversationComponent],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
