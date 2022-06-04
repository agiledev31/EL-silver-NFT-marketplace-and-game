import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent {
  @ViewChild('content') content: any;

  constructor(private modalService: NgbModal) { }
  open() {
    this.modalService.open(this.content, { size: 'xl', centered: true });

  }
  close() {
    this.modalService.dismissAll();
  }

}
