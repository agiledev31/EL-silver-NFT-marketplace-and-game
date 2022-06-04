import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AcademyRoutingModule } from './academy-routing.module';
import { AcademyDefaultComponent } from './academy-default/academy-default.component';
import { AcademyDetailsComponent } from './academy-details/academy-details.component';
import { LatestReleaseComponent } from './latest-release/latest-release.component';
import { KeepEyeComponent } from './keep-eye/keep-eye.component';
import { TradingComponent } from './trading/trading.component';
import { FeatureComponent } from './feature/feature.component';


@NgModule({
  declarations: [AcademyDefaultComponent, AcademyDetailsComponent, LatestReleaseComponent, KeepEyeComponent, TradingComponent, FeatureComponent],
  imports: [
    CommonModule,
    AcademyRoutingModule
  ]
})
export class AcademyModule { }
