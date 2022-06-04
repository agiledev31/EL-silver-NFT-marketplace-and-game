import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step5',
  templateUrl: './step5.component.html',
  styleUrls: ['./step5.component.css']
})
export class Step5Component implements OnInit, OnDestroy {
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
  toStep6() {
    let url = this.p2pType === 1 ? '/trade/p2p/buy/6' : '/trade/p2p/sell/6';
    this.router.navigate([url]);
  }
  ngOnDestroy() {
    this.userRouteService.unsubscribe();
  } 
}
