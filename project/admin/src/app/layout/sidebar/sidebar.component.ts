import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  public isMenuCollapsed = true;
  public isSettingCollapsed =true;
  userSidebarService: Subscription = new Subscription();
  constructor(private router: Router) {
   this.userSidebarService = router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.sidebarSmCollapse();
      }

    });
  }
  ngOnInit(): void {
  }
  sidebarSmCollapse() {

    const element = document.getElementsByTagName('body')[0];

      element.classList.remove('sidebar-mobile-main');


  }

  ngOnDestroy() {
    this.userSidebarService.unsubscribe();
  }

}
