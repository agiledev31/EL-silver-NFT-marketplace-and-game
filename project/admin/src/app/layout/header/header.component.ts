import { Component, OnInit, Output, EventEmitter,OnDestroy } from '@angular/core';
import { UserService } from 'src/app/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isTreeCollapsed = true;
  userHeaderService: Subscription = new Subscription();
  currentUser = null;
  constructor(private userService: UserService, private router: Router) {
   this.userHeaderService = this.userService.currentUser.subscribe(
    (userData) => {
      this.currentUser = userData as any;
    })
  }

  ngOnInit(): void {
  }

  sidebarLgCollapse() {
    const element = document.getElementsByTagName('body')[0];
    if (element.classList.contains('sidebar-xs')) {
      element.classList.remove('sidebar-xs');
    } else {
      element.classList.add('sidebar-xs');
    }


  }
  sidebarSmCollapse() {
    const element = document.getElementsByTagName('body')[0];
    if (element.classList.contains('sidebar-mobile-main')) {
      element.classList.remove('sidebar-mobile-main');
    } else {
      element.classList.add('sidebar-mobile-main');
    }
  }
  onLogoutClick() {
    this.userService.purgeAuth();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy() {
    this.userHeaderService.unsubscribe();
  }
}
