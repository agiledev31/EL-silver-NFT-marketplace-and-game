import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { ConversationComponent } from './conversation/conversation.component';



const routes: Routes = [
  {path: '', component: ChatComponent , children: [
    {path: ':id', component: ConversationComponent},
  ]},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class ChatRoutingModule { }
