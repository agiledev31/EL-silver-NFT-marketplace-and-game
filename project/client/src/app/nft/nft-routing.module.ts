import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NFTComponent } from './nft.component';
import { NFTDefaultComponent } from './nftdefault/nftdefault.component';
import { NFTDetailsComponent } from './nftdetails/nftdetails.component';

const routes: Routes = [
  {
    path:'',component:NFTComponent, children:[
      {
        path:'',component: NFTDefaultComponent
      },
      {
        path:'details/:id',component:NFTDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NFTRoutingModule { }
