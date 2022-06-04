import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-latest-release',
  templateUrl: './latest-release.component.html',
  styleUrls: ['./latest-release.component.css']
})
export class LatestReleaseComponent implements OnInit {

  constructor(private router: Router) { }
  releaseArray =[
    {
      id:1,
      Img:'/assets/images/cat.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['DeFi','Ethereum','+1'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
       id:1,
      Img:'/assets/images/iron.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['DeFi','Ethereum','+1'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
      id:1,
      Img:'/assets/images/gift.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['DeFi','Ethereum','+1'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
      id:1,
      Img:'/assets/images/4tth.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['DeFi','Ethereum','+1'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
      id:1,
      Img:'/assets/images/cat.png',
      key:'What IS Shiba Inu (SHIB) ?',
      links:['DeFi','Ethereum','+1'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },
    {
      id:1,
      Img:'/assets/images/6th.png',
      key:'How to Use the Ronin Wallets ?',
      links:['DeFi','Ethereum','+1'],
      level:'Beginner',
      date:'Nov 8 2021',
      time:'6m'
    },

  ]
  ngOnInit(): void {
  }
  gotoDetails(id:number) {
    this.router.navigate(['/academy/details',id])

  }
}
