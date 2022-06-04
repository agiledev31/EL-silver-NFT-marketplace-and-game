import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.css']
})
export class Step1Component implements OnInit {
  page = 4;

  selectedcurrency= 1;
  selectedcountry = 1;
  selectedpayment = 1;
  selectedorder = 1;

currency = [
      { id: 1, name: 'Currency' },
      { id: 2, name: 'Saab' },
      { id: 3, name: 'Opel' },
      { id: 4, name: 'Audi' },
  ];

  sorting = [
    { id: 1, name: 'Relevance' },
    { id: 2, name: 'Ordering' },
    { id: 3, name: 'Relevance' },
    { id: 4, name: 'Ordering' },
];

country = [
    { id: 1, name: 'Country' },
    { id: 2, name: 'Saab' },
    { id: 3, name: 'Opel' },
    { id: 4, name: 'Audi' },
];

payment = [
  { id: 1, name: 'Payment Method' },
  { id: 2, name: 'Saab' },
  { id: 3, name: 'Opel' },
  { id: 4, name: 'Audi' },
];

p2pType = 1;
constructor(private router: Router) {
  this.router.events.subscribe((evt) => {
    if(router.url.includes('buy')) {
      this.p2pType = 1;
    } else if(router.url.includes('sell')){
      this.p2pType = 2;
    } else if(router.url.includes('manage-sell')){
      this.p2pType = 3;
    } else if(router.url.includes('manage-buy')){
      this.p2pType = 4;
    } else {
      this.p2pType = 3;
    }

});
}
  ngOnInit(): void {
  }
  onStepClick() {
    let url = this.p2pType === 1 ? '/trade/p2p/buy/2' : '/trade/p2p/sell/2';
    this.router.navigate([url]);
  }

}
