import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, } from '@angular/router';
import { UserService } from 'src/app/core';
import { ChatService } from '../chat.service';
import * as moment from 'moment';
import { SocketService } from './../../core/services/socket.service';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  page = 1;

  selectedUserId:any = null;
  chatUser: any = null;
  currentUser:any = null;
  isLoader = false;

  chat = [];
  message = '';
    private sub: any;

    @ViewChild('scrollMe') scrollMe!: ElementRef;
    constructor(private chatService: ChatService,
      private userService: UserService,
      private route: ActivatedRoute,
      private router: Router) {
        this.sub = this.route.params.subscribe(params => {
        this.selectedUserId = params['id'] || null; //
        this.currentUser = this.userService.getCurrentUser();

        if(this.selectedUserId) {
          this.getHistoryAndUser();
          this.isLoader = true;
          this.subscribeToUpdateConversation()
        }
     });
     }

  ngOnInit(): void {
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  subscribeToUpdateConversation() {
    this.chatService.getConversationEvent(this.currentUser._id)
    .subscribe((e:any) => {

      this.getHistoryAndUser()});
  }
  scrollToBottom(): void {
    try {
      this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    } catch (err) { }
  }
  getHistoryAndUser() {

    let params = new HttpParams()
    .set('page', this.page.toString())
    this.chatService.getHistoryAndUser(this.selectedUserId, params.toString()).subscribe((res:any) => {
      if(res.status == 200) {
        this.chatUser =  res.data.ChatUser;
        let chat = res.data.history.docs;
        this.chat = chat.map((c:any) => {return {...c, fromNow: moment(c.createdAt).fromNow()}})
      }else {
        this.chatUser =  null;
        this.chat = [];
      }
      this.isLoader = false;
    }, err => {
      this.chat = [];
      this.chatUser = null;
      this.isLoader = false;
    })
  }
  sendMessage() {

    this.chatService.sendMessage({message:this.message, sentTo: this.selectedUserId}).subscribe((res: any) =>{
      if(res.status === 200) {
        this.getHistoryAndUser();
        this.message = '';
      }
    });
  }
  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
