import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css']
})
export class Step3Component implements OnInit, OnDestroy {

  p2pType = 1;
  userRouteService: Subscription = new Subscription();
  constructor(private router: Router) {
    this.userRouteService = this.router.events.subscribe((evt) => {
      if(router.url.includes('buy')) {
        this.p2pType = 1;
      } else {
        this.p2pType = 2;
      }

  });
  }
  ngOnInit(): void {
  }
  ngOnDestroy() {
    this.userRouteService.unsubscribe();
  } 
}
