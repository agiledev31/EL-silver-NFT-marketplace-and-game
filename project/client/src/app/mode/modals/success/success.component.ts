import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-join-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent  {
  @ViewChild('content') content: any;

  constructor(private modalService: NgbModal) { }
  open() {
    this.modalService.open(this.content, { size: 'xl', centered: true });

  }
  close() {
    this.modalService.dismissAll();
  }

}
