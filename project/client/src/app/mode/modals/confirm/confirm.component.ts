import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  @ViewChild('content') content: any;

  constructor(private modalService: NgbModal) { }
  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });

  }
  close() {
    this.modalService.dismissAll();
  }


}
