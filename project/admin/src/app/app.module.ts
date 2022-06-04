import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { LayoutComponent } from './layout/layout.component';
import { CoreModule } from './core';
import { SharedModule } from './shared/shared.module';
import { LolChallengeComponent } from './lolchallenge/lolchallenge/lolchallenge.component';
import {LolChallengeModule} from "./lolchallenge/lolchallenge.module";


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HeaderComponent,
    LayoutComponent,
    LolChallengeComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        SharedModule,
        CoreModule,
        NgbModule,
        LolChallengeModule,

        
    ],
  providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }],
  bootstrap: [AppComponent]
})
export class AppModule { }
