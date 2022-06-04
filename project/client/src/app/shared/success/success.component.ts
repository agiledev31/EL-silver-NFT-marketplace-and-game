import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from 'src/app/core';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  title = '';
  text = '';

  closeResult: string | undefined;
  @ViewChild('content') content: any;
  currentUser : any;
  constructor(private modalService: NgbModal,
    private userService: UserService,private router: Router) { }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(user => this.currentUser = user);
  }
  open() {
    this.modalService.open(this.content, { size: 'lg', centered: true });
  }
  close() {
    this.modalService.dismissAll()
  }
  onClickSubmit(route: string) {
    this.close();
    this.router.navigate([route]);
  }
}
