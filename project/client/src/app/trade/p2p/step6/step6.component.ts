import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.css']
})
export class Step6Component implements OnInit, OnDestroy {

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
  goToList() {
    let url = this.p2pType === 1 ? '/trade/p2p/buy/1' : '/trade/p2p/sell/1';
    this.router.navigate([url]);
  }
  
  ngOnDestroy() {
    this.userRouteService.unsubscribe();
  } 

}
