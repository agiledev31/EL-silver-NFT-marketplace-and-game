import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainSliderComponent } from './main-slider/main-slider.component';
import { SharedModule } from '../shared/shared.module';
import { GamemodesComponent } from './gamemodes/gamemodes.component';
import { InvestComponent } from './invest/invest.component';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { NgxSlickJsModule } from 'ngx-slickjs';
import { TournamentsComponent } from './tournaments/tournaments.component';
import { CommunityComponent } from './community/community.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { TradeService } from '../core/services/trade.service';

@NgModule({
  declarations: [MainSliderComponent, GamemodesComponent, InvestComponent, HomeComponent, TournamentsComponent, CommunityComponent, CreateAccountComponent],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule,
    NgxSlickJsModule.forRoot({
      links: {
        jquery: "https://code.jquery.com/jquery-3.4.0.min.js",
        slickJs:
          "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js",
        slickCss:
          "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.css",
        slickThemeCss:
        "https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick-theme.css",
      }
    })
  ],
  exports:[
    MainSliderComponent,
    GamemodesComponent,
    InvestComponent,
  ]
})
export class HomeModule {
  constructor(private tradeService: TradeService) {
    this.tradeService.populateSilver();
  }
}
