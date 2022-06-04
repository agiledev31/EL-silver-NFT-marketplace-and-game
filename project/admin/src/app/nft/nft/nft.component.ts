import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/core';
import { utils } from 'ethers';
import { Web3Service } from 'src/app/core/services/web3service';
import { Toast } from 'src/app/_constants/SwalToast'; 

@Component({
  selector: 'app-Nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css'],
})
export class NftComponent implements OnInit {
  nftname = '';
  nftrate = '100';
  nftprice = '1';
  nftmetadatauri = '';
  nftcount = '1000';
  nftcurrency = 1;

  shopItems: any = [];
  shop_selected = "";
  sel_mrId = '';
  sel_shopname = '';
  sel_shoprate = '';
  sel_shopprice = '';
  sel_shopmetadatauri = '';
  sel_shopcount = '';
  sel_shopcurrency = 1;
  sel_price = 0;

  metadata_baseuri = '';
  buy_dex_rate = '';
  sell_dex_rate = '';
  totalBNBBalance = '';
  totalBNBBalance721 = ''
  withdrawBalance = '';
  withdrawBalance721 = ''
  isLoader = false;

  async getMetaDataBaseURI() {
    this.isLoader = true;
    this.metadata_baseuri = await this.web3Service.getMetaDataBaseURI();
    this.isLoader = false;
  }
  async setMetaDataBaseURI() {
    this.isLoader = true;
    await this.web3Service.setMetaDataBaseURI(this.metadata_baseuri);
    this.isLoader = false;
  }
  async getBuyDexRate() {
    this.isLoader = true;
    this.buy_dex_rate = await this.web3Service.getBuyDexRate(
      this.web3Service.getBEP20Contract()
    );
    this.isLoader = false;
  }
  async setBuyDexRate() {
    this.isLoader = true;
    await this.web3Service.setBuyDexRate(this.buy_dex_rate);
    this.isLoader = false;
  }
  async getSellDexRate() {
    this.isLoader = true;
    this.sell_dex_rate = await this.web3Service.getSellDexRate(
      this.web3Service.getBEP20Contract()
    );
    this.isLoader = false;
  }
  async setSellDexRate() {
    this.isLoader = true;
    await this.web3Service.setSellDexRate(this.sell_dex_rate);
    this.isLoader = false;
  }
  async getTotalBNBBalance(contract_number: number ) {
    this.isLoader = true;
    try{
      let balance = await this.web3Service.getTotalBNBBalance(contract_number );
      balance = this.web3Service.getPrice(1, balance )
      if(contract_number == 721 ){
        this.totalBNBBalance721 = balance
      }else{
        this.totalBNBBalance = balance
      }
    }catch{
      this.isLoader = false
    }
    this.isLoader = false;
  }
  async runWithdrawBalance(contract_number: number ) {
    this.isLoader = true;
    try{
      await this.web3Service.runWithdrawBalance(contract_number == 721 ? this.withdrawBalance721 : this.withdrawBalance, contract_number );
    }catch{
      this.isLoader = false
    }
    this.isLoader = false;
  }

  constructor(
    private userService: UserService,
    public web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    this.fetchShop();
  }

  selectShopItem(value ) {
    this.shop_selected = value;
    for (let i = 0; i < this.shopItems.length; i++) {
      let item = this.shopItems[i];
      if (this.shop_selected == item.mrId) {
        this.sel_shopname = item.name;
        this.sel_shoprate = item.rate;
        this.sel_shopprice = this.web3Service.getPrice(
          item.currency,
          item.mrPrice,
          false
        );
        this.sel_price = item.mrPrice;
        this.sel_shopmetadatauri = item.mrMetaDataURI;
        this.sel_shopcount = item.maxCount;
        this.sel_shopcurrency = item.currency;
        this.sel_mrId = item.mrId;
      }
    }
  }

  async fetchShop() {
    try{
      await this.web3Service.beforeProgressing();
      this.isLoader = true;
      this.shopItems = await this.web3Service.fetchNftItemFromShop();
      if (this.shopItems.length > 0 ){
        this.shop_selected = this.shopItems[0].mrId;
        this.selectShopItem(this.shop_selected);
      }
      this.isLoader = false;
    }catch{
      this.isLoader = false;
    }
  }

  async createNewItem() {
    try{
    await this.web3Service.beforeProgressing();

    this.isLoader = true;
    const etherPrice = utils.parseEther(this.nftprice.toString());
    const BEP721Contract = await this.web3Service.getBEP721Contract();
    const res = await BEP721Contract.methods
      .mintMrId(
        this.nftname,
        this.nftrate,
        etherPrice,
        this.nftmetadatauri,
        this.nftcount,
        this.nftcurrency
      )
      .send({
        from: this.web3Service.getConnectedAccount(),
      });
      this.isLoader = false;
      Toast.fire({ icon: 'success', titleText: 'Successfuly created!' });
    }catch{
      this.isLoader = false;
    }
  }

  async updateShop(type: number) {
    this.isLoader = true;
    switch (type) {
      case 1: // name
        await this.web3Service.setShopItem(this.sel_mrId, type, this.sel_shopname);
        break;
      case 2: // rate
        await this.web3Service.setShopItem(this.sel_mrId, type, this.sel_shoprate);
        break;
      case 3: // price
        let tmp_price = utils.parseEther(this.sel_shopprice.toString());
        await this.web3Service.setShopItem(this.sel_mrId, type, tmp_price);
        break;
      case 4: // meta data
        await this.web3Service.setShopItem(
          this.sel_mrId,
          type,
          this.sel_shopmetadatauri
        );
        break;
      case 5: // count
        await this.web3Service.setShopItem(this.sel_mrId, type, this.sel_shopcount);
        break;
      case 6: // currency
        await this.web3Service.setShopItem(
          this.sel_mrId,
          type,
          this.sel_shopcurrency
        );
        break;
    }
    this.isLoader = false;
  }
}
