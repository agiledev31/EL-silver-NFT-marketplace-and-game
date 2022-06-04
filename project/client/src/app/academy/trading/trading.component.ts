import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-trading',
  templateUrl: './trading.component.html',
  styleUrls: ['./trading.component.css']
})
export class TradingComponent implements OnInit {
  constructor() { }
  releaseArray =[
    {
      Img:'/assets/images/t1.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['trading'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
      Img:'/assets/images/t2.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['trading'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
      Img:'/assets/images/t3.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['trading'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },


  ]
  ngOnInit(): void {
  }

}
