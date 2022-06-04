import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ListComponent } from './list/list.component';
import { P2PPostRoutingModule } from './p2p-post-routing.module';



@NgModule({
  declarations: [ListComponent],
  imports: [CommonModule, P2PPostRoutingModule, SharedModule],
})
export class P2pPostModule { }
