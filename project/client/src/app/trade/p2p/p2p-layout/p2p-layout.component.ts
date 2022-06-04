import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-p2p-layout',
  templateUrl: './p2p-layout.component.html',
  styleUrls: ['./p2p-layout.component.css']
})
export class P2pLayoutComponent implements OnInit, OnDestroy {

  p2pType = 1;
  title = '';
  userRouteService: Subscription = new Subscription();
  constructor(private router: Router) {
   this.userRouteService = this.router.events.subscribe((evt) => {
      if(router.url.includes('buy')) {
        this.p2pType = 1;
      } else {
        this.p2pType = 2;
      }
      let step = +router.url.split('/')[4];
      if(step == 1) {
        this.title = 'TRADE SILVER FROM PERSON TO PERSON';
      } else if(step == 2) {
        this.title =(this.p2pType ==1 ? 'Buy' : 'Sell' )+ ' Silver through National Bank Transfer with KRW';

      } else  {
        this.title = 'Trade Details'
      }
  });
  }

  ngOnInit(): void {
  }

  ngOnDestroy() {
    this.userRouteService.unsubscribe();
  }

}
