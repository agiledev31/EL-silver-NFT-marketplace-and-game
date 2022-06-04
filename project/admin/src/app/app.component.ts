import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from './core';
import { ConstantService } from './core/services/constant.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  userRouteEvents: Subscription = new Subscription();
  constructor(private router: Router, private userService: UserService, private contService: ConstantService) { }

  ngOnInit() {
    // TODO get App context
    // TODO get App constants
    this.contService.getRegions();
    this.contService.getTournamentStatus();
    this.userService.populate();
    this.userRouteEvents = this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  ngOnDestroy() {
    this.userRouteEvents.unsubscribe();
  }
}
