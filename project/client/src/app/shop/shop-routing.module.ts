import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ShopDefaultComponent } from './shopdefault/shopdefault.component';
import { ShopDetailsComponent } from './shopdetails/shopdetails.component';
import { ShopExchangeComponent } from './shopexchange/shopexchange.component';

const routes: Routes = [
  {
    path:'',component:ShopComponent, children:[
      {
        path:'',component: ShopDefaultComponent
      },
      {
        path:'details/:id',component:ShopDetailsComponent
      },
      {
        path:'exchange',component:ShopExchangeComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
