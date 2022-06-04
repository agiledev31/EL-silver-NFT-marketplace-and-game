import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from '@ng-bootstrap/ng-bootstrap';
import { Slick } from 'ngx-slickjs';
import { TradeService } from './../../core/services/trade.service';
@Component({
  selector: 'app-invest',
  templateUrl: './invest.component.html',
  styleUrls: ['./invest.component.css']
})
export class InvestComponent implements OnInit {
  silver: any;

  config: Slick.Config = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    variableWidth: true,
    autoplaySpeed: 10000
  };
  config1: Slick.Config = {
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    dots: false,
    autoplay: true,
    variableWidth: false,
    autoplaySpeed: 10000
  };

  constructor(config: NgbCarouselConfig, private tradeService: TradeService) {
    config.interval = 10000;
    config.wrap = true;
    config.keyboard = false;
    config.pauseOnHover = false;
  }

  ngOnInit(): void {
    this.getSilver();
  }

  getSilver(): void {
    this.tradeService.currentSilver.subscribe((silver: any) => this.silver = silver);
  }

}
