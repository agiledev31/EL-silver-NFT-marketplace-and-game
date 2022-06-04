import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
@Component({
  selector: 'app-initiated',
  templateUrl: './initiated.component.html',
  styleUrls: ['./initiated.component.css']
})
export class InitiatedComponent  {
  @ViewChild('content') content: any;
  @Input() tournament: any;

  constructor(private modalService: NgbModal, private router: Router) { }
  open() {
    this.modalService.open(this.content, { size: 'xl', centered: true });

  }
  close() {
    this.modalService.dismissAll();
  }
  onUpcomingClick() {
    this.close();
    this.router.navigate(['/mode/tournament']);
  }

}
