import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Slick } from 'ngx-slickjs';
import { MatchService,  UserService } from 'src/app/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import swal from 'sweetalert2';
import { Toast } from 'src/app/_constants/SwalToast';
import  Swal  from 'sweetalert2';

@Component({
  selector: 'app-mode',
  templateUrl: './mode.component.html',
  styleUrls: ['./mode.component.css']
})
export class ModeComponent implements OnInit {

  config: Slick.Config = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    variableWidth: true,
    autoplaySpeed: 10000
  }
  config1: Slick.Config = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    variableWidth: false,
    autoplaySpeed: 10000
  }
  currentUser: any = null;
  userHeaderService: Subscription = new Subscription();
  constructor(private matchService: MatchService, private router: Router, private modalService: NgbModal,private userService: UserService) {

     this.userHeaderService = this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData as any;
      });
   }

  ngOnInit(): void {
  }
  onPlayClick(type: number) {
    this.matchService.setType(type);
    // if(type === 1) {
    //   this.router.navigate(['/match/setup/solo']);
    // } else if(type === 2) {
    //   this.router.navigate(['/match/setup/5v5']);
    // }
    Swal.fire({
      title: "Coming soon",
      text:"This Feature is coming soon",
      icon: 'info',
    })

  }
  userSwal(){

    if(!this.currentUser){
    Swal.fire({
          title: "Please Register to continue",
          text: `redirecting to Login page`,
          icon: 'warning',
          showCancelButton: false,
          showConfirmButton: false,
          timer:2125
        }).then( () =>{
          window.location.href = '/auth/login'
        })
  }
  }

  openLobbyCodePopup(content: any): void {
    this.modalService.open(content, { centered: true });
  }
}
