import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExchangeComponent } from './exchange.component';
import { ExchangeDefaultComponent } from './exchangedefault/exchangedefault.component';

const routes: Routes = [
  {
    path:'',component:ExchangeComponent, children:[
      {
        path:'',component: ExchangeDefaultComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExchangeRoutingModule { }
