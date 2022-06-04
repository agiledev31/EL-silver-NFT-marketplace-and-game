import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NFTRoutingModule } from './nft-routing.module';
import { NFTComponent } from './nft.component';
import { NFTDefaultComponent } from './nftdefault/nftdefault.component';
import { NFTDetailsComponent } from './nftdetails/nftdetails.component';


@NgModule({
  declarations: [
    NFTComponent,
    NFTDefaultComponent,
    NFTDetailsComponent
  ],
  imports: [
    CommonModule,
    NFTRoutingModule
  ]
})
export class NFTModule { }
