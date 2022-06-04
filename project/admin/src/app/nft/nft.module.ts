import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NftComponent } from './nft/nft.component';
import { NftRoutingModule } from './nft-routing.module';
@NgModule({
  declarations: [NftComponent],

  imports: [
    CommonModule,
    NftRoutingModule
  ],
  exports: [
  ]
})
export class NftModule { }
