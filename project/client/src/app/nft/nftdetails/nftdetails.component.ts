import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isInteger } from 'lodash';
import { Web3Service } from 'src/app/core/services/web3.service';
import { environment } from 'src/environments/environment';
import { Toast } from 'src/app/_constants/SwalToast';
import { env } from 'process';

@Component({
  selector: 'app-nftdetails',
  templateUrl: './nftdetails.component.html',
  styleUrls: ['./nftdetails.component.css'],
})
export class NFTDetailsComponent implements OnInit {
  manageYours = true;
  properties = true;
  details = true;
  display = 'none';
  wallet = 'BNB';
  itemId: any;
  totalPrice: any = 0;

  lowestItem = {
    currency: 1,
    owner: '',
    price: -1,
    tokenId: '',
    description: '',
    imageURI: '',
    mrId: '',
    mrMetaDataURI: '',
    name: '',
    rate: '',
    maxCount: 0,
    curCount: 0,
    mrPrice: 0,
  };

  shopItems: any;
  shopItem = {
    currency: 1,
    owner: '',
    price: -1,
    tokenId: '',
    description: '',
    imageURI: '',
    mrId: '',
    mrMetaDataURI: '',
    name: '',
    rate: '',
    maxCount: 0,
    curCount: 0,
    mrPrice: 0,
  };

  nftItems: any;
  nftReverseItems: any;
  nftItem: any;
  showNftItems: any;

  contractAddress: any;
  ipfsJSON: any = '';
  supplyCount: any;
  selItem = {
    currency: 1,
    maxCount: 0,
    curCount: 0,
    owner: '',
    price: 10000000,
    tokenId: '',
    description: '',
    imageURI: '',
    mrId: '',
    mrMetaDataURI: '',
    name: '',
    rate: '',
    mrPrice: 0,
  };
  isLoader = false;
  bsscanURI: any;
  sort_dir = true;
  total_page = 1;
  now_page = 1;
  page_size = 10;

  maxMintCount = 1;
  remainMintCount = 1;
  sellerCount = 1;
  totalSellingTokens: any = 1;

  mintDisplay = 'none';
  ballanceInWallet = '0 BNB';
  buyItemCount: any = '';
  myOwned: any = false
  property = true

  constructor(private route: ActivatedRoute, public web3Service: Web3Service) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.itemId = params.get('id');
    });

    this.fetchNFTInfo();
    this.contractAddress = environment.REACT_APP_MR_BEP721_CONTRACT_ADDR;
    this.bsscanURI = environment.BSScan_URI;
  }

  async getBallanceInWallet() {
    let ballance = '';
    let accountNumber = await this.web3Service.getAccountNumber();
    if (this.shopItem.currency == environment.CURRENCY_BNB) {
      ballance = await this.web3Service.Get_BNB_Balance(accountNumber);
    } else {
      ballance = await this.web3Service.Get_LPLT_Balance(accountNumber);
    }
    return this.web3Service.getPrice(this.shopItem.currency, ballance);
  }

  async getSellerCountByMrID(mrID: any) {
    this.sellerCount = await this.web3Service.getOwnerCountByMrId(mrID, 1);
  }

  mintItemModal(item: any) {
    this.mintDisplay = 'block';
  }

  getPrice(currency: any, mrPrice: any) {
    return this.web3Service.getPrice(currency, mrPrice);
  }

  displayAddress(addr: any) {
    return String(addr).substring(0, 6) + '...' + String(addr).substring(38);
  }

  async fetchNFTInfo() {
    this.shopItems = await this.web3Service.fetchNftItemFromShop();
    const BEP721Contract = await this.web3Service.getBEP721Contract();
    const uri = await BEP721Contract.methods.baseURI().call();

    for (let i = 0; i < this.shopItems.length; i++) {
      let tmp = this.shopItems[i];
      if (tmp.mrId == this.itemId) {
        this.shopItem = { ...tmp };
        this.ipfsJSON = uri + tmp.mrMetaDataURI;
        console.log(this.shopItem);
        break;
      }
    }

    let tmp_nftItems = await this.web3Service.fetchItemFromMarketPlace();
    console.log(tmp_nftItems);
    this.nftItems = [];

    for (let i = 0; i < tmp_nftItems.length; i++) {
      let tmp = tmp_nftItems[i];
      if (this.itemId == tmp.mrId) {
        this.nftItems.push(tmp);
        if (this.lowestItem.price == -1 || this.lowestItem.price > tmp.price) {
          this.lowestItem = { ...tmp };
        }
      }
    }

    // for (let i = 0; i < 3000; i++) {
    //   let price = Math.ceil(Math.random() * 100000000000000000000);
    //   this.nftItems.push({
    //     owner: i + 'abcefghi',
    //     price: price.toString(),
    //     tokenId: 'aa',
    //     description: 'bb',
    //     imageURI: '',
    //     mrId: '123',
    //     mrMetaDataURI: '321',
    //     name: '12233',
    //     rate: '123',
    //   });
    // }

    this.nftItems = this.nftItems.sort(function (a: any, b: any) {
      return a.price - b.price;
    });
    this.nftReverseItems = [...this.nftItems];
    this.nftReverseItems.reverse();
    this.total_page = Math.ceil(this.nftItems.length / this.page_size);
    this.supplyCount = this.nftItems.length;
    this.ballanceInWallet = await this.getBallanceInWallet();

    this.getSellerCountByMrID(this.shopItem.mrId);
    this.totalSellingTokens = this.nftItems.length;
    this.totalSellingTokens =
      this.totalSellingTokens > 999
        ? parseFloat(parseFloat(parseInt(this.totalSellingTokens) / 1000 + '').toFixed(3)) + 'K'
        : this.totalSellingTokens;

    let invs = await this.web3Service.fetchUserInventory(await this.web3Service.getAccountNumber())
    let inv_result:any = invs.result

    for(let i = 0; i < inv_result.length; i++ ){
      if (this.shopItem.mrId == inv_result[i].itemId ){
        this.myOwned = true
        break;
      }
    }

    this.showItems();
  }

  showItems() {
    let start = (this.now_page - 1) * this.page_size;
    let end = start + this.page_size - 1;
    end = end > this.supplyCount - 1 ? this.supplyCount - 1 : end;
    this.showNftItems = [];
    for (var i = start; i <= end; i++) {
      this.showNftItems.push(
        this.sort_dir ? this.nftItems[i] : this.nftReverseItems[i]
      );
    }
  }

  changeSort() {
    this.sort_dir = !this.sort_dir;
    this.showItems();
  }

  changePage(dir: number) {
    this.now_page += dir;
    this.now_page = this.now_page == 0 ? 1 : this.now_page;
    this.now_page =
      this.now_page > this.total_page ? this.total_page : this.now_page;

    this.showItems();
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
  show5() {
    this.property = !this.property;
  }

  onCloseMintHandled() {
    this.mintDisplay = 'none';
  }

  onCloseHandled() {
    this.display = 'none';
  }
  openModal() {
    this.display = 'block';
  }
  payto(value: string) {
    this.wallet = value;
  }

  async buyNFTItem(tmpItem: any) {
    this.display = 'block';
    this.selItem = tmpItem;
  }

  async processNFTItem(): Promise<any> {
    await this.web3Service.beforeProgressing();

    this.isLoader = true;
    try {
      await this.web3Service.handleBuy(
        this.selItem.tokenId,
        this.selItem.price
      );
      this.fetchNFTInfo();
    } catch {
      this.isLoader = false;
      return false;
    }

    this.display = 'none';
    this.isLoader = false;
  }

  getBuyPrice(currency: any, mrPrice: any, count: any): any {
    mrPrice = this.web3Service.getPrice(currency, mrPrice, false );
    let p = mrPrice * count;

    this.totalPrice = p + (currency == 1 ? 'BNB' : 'LPLT')// this.web3Service.getPrice(currency, p + '');
    return this.totalPrice;
  }

  async clickPurchaseItem(): Promise<any> {
    if (this.shopItem.maxCount - this.shopItem.curCount < this.buyItemCount) {
      Toast.fire({ icon: 'error', titleText: 'amount exceeds total count' });
      return false;
    }

    if (
      parseInt(this.buyItemCount) > 10 ||
      isNaN(parseInt(this.buyItemCount))
    ) {
      Toast.fire({
        icon: 'error',
        titleText: 'You must input the count between 1 and 10!',
      });
      return false;
    }

    let price = this.shopItem.mrPrice * this.buyItemCount;
    let balance = -1;

    if ((await this.web3Service.isConected()) == false) {
      this.web3Service.init();
      this.web3Service.setWeb3Modal(this.web3Service.getWeb3Modal());

      let providerObj;
      try {
        providerObj = await this.web3Service.Web3Modal.connect();
        this.web3Service.setProvider(providerObj);
      } catch (e) {
        console.log('Could not get a wallet connection', e);
        return false;
      }

      await this.web3Service.fetchAccountData();
    }

    if (this.shopItem.currency == environment.CURRENCY_BNB) {
      balance = await this.web3Service.Get_BNB_Balance(
        this.web3Service.getConnectedAccount()
      );
    } else {
      balance = await this.web3Service.Get_LPLT_Balance(
        this.web3Service.getConnectedAccount()
      );
    }
    if (price > balance) {
      Toast.fire({
        icon: 'error',
        titleText: 'ELSILVER : Transfer amount exceeds balance',
      });
      return false;
    }

    this.isLoader = true;
    try {
      await this.web3Service.purchaseItem(
        this.web3Service.connectedAccount,
        this.shopItem.mrId,
        this.shopItem.mrPrice,
        this.shopItem.currency,
        this.buyItemCount
      );
    } catch {
      this.mintDisplay = 'none';
      this.isLoader = false;
      return false;
    }

    this.mintDisplay = 'none';
    this.isLoader = false;
    this.shopItem.curCount =
      parseInt(this.shopItem.curCount.toString()) + parseInt(this.buyItemCount);
    this.ballanceInWallet = await this.getBallanceInWallet();
    Toast.fire({ icon: 'success', titleText: 'Success!' });
  }
}
