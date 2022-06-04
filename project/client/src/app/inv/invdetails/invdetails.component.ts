import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from 'src/app/core/services/web3.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invdetails',
  templateUrl: './invdetails.component.html',
  styleUrls: ['./invdetails.component.css'],
})
export class InvDetailsComponent implements OnInit {
  manageYours = true;
  properties = true;
  details = true;
  display = 'none';
  wallet = 'BNB';
  itemId: any;
  shopItem: any = {
    name: "",
    description: "",
    mrId: "",
    currency: 1,
    mrPrice: 0
  };
  buyItemCount: any = 1;
  buyTotalPrice: any = '';
  isLoader = false;
  constructor(
    private route: ActivatedRoute,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.itemId = params.get('id');
    });

    this.showItem();
  }

  async showItem() {
    debugger;
    this.shopItem = await this.web3Service.getItemFromShop(this.itemId);
    console.log(this.shopItem );
  }

  openModal(){
    this.display = "block"
  }
}
