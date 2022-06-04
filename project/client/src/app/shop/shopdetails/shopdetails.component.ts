import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from 'src/app/core/services/web3.service';
import { Toast } from 'src/app/_constants/SwalToast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shopdetails',
  templateUrl: './shopdetails.component.html',
  styleUrls: ['./shopdetails.component.css'],
})
export class ShopDetailsComponent implements OnInit {
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

  async showItem(): Promise<any>  {
    this.shopItem = await this.web3Service.getItemFromShop(this.itemId);
    this.getBuyPrice(this.shopItem.currency, this.shopItem.mrPrice, 1);
  }

  getPrice(currency: any, mrPrice: any) :any{
    return this.web3Service.getPrice(currency, mrPrice);
  }

  getBuyPrice(currency: any, mrPrice: any, count: any):any {
    let p = mrPrice * count;
    this.buyTotalPrice = this.web3Service.getPrice(currency, p + '');
    return this.buyTotalPrice;
  }

  async clickPurchaseItem() : Promise<any> {
    
    let price = this.shopItem.mrPrice * this.buyItemCount;
    let balance = -1;
  
    if (await this.web3Service.isConected() == false ) {
      this.web3Service.init();
      this.web3Service.setWeb3Modal(this.web3Service.getWeb3Modal());

      let providerObj;
      try {
        providerObj = await this.web3Service.Web3Modal.connect();
        this.web3Service.setProvider(providerObj);
      } catch (e) {
        console.log('Could not get a wallet connection', e);
        return;
      }

      await this.web3Service.fetchAccountData();
    }

    if (this.shopItem.currency == environment.CURRENCY_BNB ){
      balance = await this.web3Service.Get_BNB_Balance(this.web3Service.getConnectedAccount());
    }else{
      balance = await this.web3Service.Get_LPLT_Balance(this.web3Service.getConnectedAccount());
    }
    if (price > balance ){
      Toast.fire({ icon: 'error', titleText: 'ELSILVER : Transfer amount exceeds balance' });
      return false;
    }

    this.isLoader = true
    try{
      await this.web3Service.purchaseItem(this.web3Service.connectedAccount, this.shopItem.mrId, this.shopItem.mrPrice, this.shopItem.currency, this.buyItemCount );
    }catch{
      this.display = "none"
      this.isLoader = false;
    }
    this.display = "none";
    this.isLoader = false;
    Toast.fire({ icon: 'success', titleText: 'Success!' });
  }

  show1() {
    this.manageYours = !this.manageYours;
  }
  show2() {
    this.properties = !this.properties;
  }
  show3() {
    this.details = !this.details;
  }

  onCloseHandled() {
    this.display = 'none';
  }
  async openModal() { 
    this.display = 'block';
  }
  payto(value: string) {
    this.wallet = value;
  }
}
