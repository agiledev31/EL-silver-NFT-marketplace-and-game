import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  isFooter = true;
  constructor(private router: Router) { 
    router.events.subscribe((e) => {
      if(router.url.includes('auth')) {
         this.isFooter = false;
       } else {
        this.isFooter = true;
       }
    })
  }

  ngOnInit(): void {
  }

}
