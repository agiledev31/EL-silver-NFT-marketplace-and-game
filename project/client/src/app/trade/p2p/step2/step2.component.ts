import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.css']
})
export class Step2Component implements OnInit, OnDestroy {

  p2pType = 1;
  userStepService: Subscription = new Subscription();
  constructor(private router: Router) {
   this.userStepService = this.router.events.subscribe((evt) => {
      if(router.url.includes('buy')) {
        this.p2pType = 1;
      } else {
        this.p2pType = 2;
      }

  });
  }
  ngOnInit(): void {
  }
  openTrade() {
    let url = this.p2pType === 1 ? '/trade/p2p/buy/3' : '/trade/p2p/sell/3';
    this.router.navigate([url]);
  }
  ngOnDestroy() {
    this.userStepService.unsubscribe();
  } 

}
