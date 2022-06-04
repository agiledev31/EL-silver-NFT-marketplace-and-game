import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NftComponent } from './nft/nft.component';


const routes: Routes = [

    {path: '' , component: NftComponent},


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NftRoutingModule { }
