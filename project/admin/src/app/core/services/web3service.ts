import { Injectable } from '@angular/core';
import Web3Modal from 'web3modal';
import { utils } from 'ethers';
import { Toast } from 'src/app/_constants/SwalToast';

const bep20_contractABI = require('../../contracts/bep20-contract-abi.json');
const bep721_contractABI = require('../../contracts/bep721-contract-abi.json');
const router_contractABI = require('../../contracts/bepRouter-contract-abi.json');

import axios from 'axios';
import { environment } from 'src/app/contracts/environment';

declare const window: any;
@Injectable({
  providedIn: 'root',
})
export class Web3Service {
  accountIndex = 0;
  providerOptions: any = {
    disableInjectedProvider: true,
    injected: {
      display: {
        name: 'MetaMask',
        description: 'For desktop web wallets',
      },
      package: null,
    },
    walletconnect: {
      display: {
        name: 'WalletConnect',
        description: 'For Mobile App Wallets',
      },
      package: null,
      options: {
        // infuraId: "40bd58898adb4907b225865d9cedcd4a",   //mainnet
        rpc: {
          97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
        },
        network: 'binance', // here
      },
      // network: 'mainnet',
    },
  };

  Web3Modal: any = null;
  Web3Obj: any = null;
  WalletConnectProvider: any = null;
  provider: any = null;
  shopList: any = null;
  shopItem: any = null;
  connectedAccount: any = null;
  routerContract: any = null;
  userInventory: any = null;

  constructor() {}

  init(): void {
    //this.Web3Modal = this.Web3Modal ? this.Web3Modal : window.Web3Modal.default;
    this.WalletConnectProvider = this.WalletConnectProvider
      ? this.WalletConnectProvider
      : window.WalletConnectProvider.default;
    this.providerOptions.walletconnect.package = this.WalletConnectProvider;
  }

  getWeb3Modal(): any {
    if (this.Web3Modal) return this.Web3Modal;
    this.Web3Modal = new Web3Modal({
      // network: "mainnet",
      cacheProvider: false,
      providerOptions: this.providerOptions,
    });
    return this.Web3Modal;
  }

  getWeb3Obj(provider: any): any {
    if (this.Web3Obj) return this.Web3Obj;
    this.Web3Obj = new window.Web3(provider);
    return this.Web3Obj;
  }

  setProvider(provider: any) {
    this.provider = provider;
  }

  getCurrentProvider() {
    return window.web3.currentProvider;
  }

  getProvider() {
    return this.provider;
  }

  closeProvider() {
    if (this.provider.close) this.provider.close();
  }

  setWeb3Modal(web3Modal: any) {
    this.Web3Modal = web3Modal;
  }

  async setApproved(amount: any) {
    let BEP20Contract = await this.getBEP20Contract();

    await BEP20Contract.methods
      .approve(environment.REACT_APP_MR_BEP721_CONTRACT_ADDR, amount)
      .send({
        from: this.connectedAccount,
      });
  }

  async getMetaDataBaseURI() {
    //721
    //function baseURI() public view returns (string memory) {
    this.beforeProgressing();
    const BEP721Contract = await this.getBEP721Contract();
    const baseURI = await BEP721Contract.methods.baseURI().call();
    return baseURI;
  }

  async setMetaDataBaseURI(baseURI: any) {
    //721
    //function setBaseURI(string memory baseURI_) public onlyOwner {
    this.beforeProgressing();
    const BEP721Contract = await this.getBEP721Contract();
    await BEP721Contract.methods.setBaseURI(baseURI).call();
    Toast.fire({ icon: 'success', titleText: 'Success!' });
  }

  async setBuyDexRate(dexRate: any) {
    //router
    //function setBuyDexRate(uint256 _dexRate) public onlyOwner{
    this.beforeProgressing();
    const bep20Contract = this.getBEP20Contract();
    await bep20Contract.methods
      .setBuyDexRate(dexRate)
      .send({ from: this.getConnectedAccount() });

    Toast.fire({ icon: 'success', titleText: 'Success!' });
  }

  async setSellDexRate(dexRate: any) {
    //function setSellDexRate(uint256 _dexRate) public onlyOwner{
    this.beforeProgressing();
    const bep20Contract = this.getBEP20Contract();
    await bep20Contract.methods
      .setSellDexRate(dexRate)
      .send({ from: this.getConnectedAccount() });

    Toast.fire({ icon: 'success', titleText: 'Success!' });
  }

  async getTotalBNBBalance(contract_address: number): Promise<any> {
    let totalBalance: any;
    try {
      this.beforeProgressing();
      const BEPContract = contract_address == 721 ? await this.getBEP721Contract() : await this.getBEP20Contract();
      totalBalance = await BEPContract.methods.getContractBalance().call();
    } catch {
      return false;
    }
    return totalBalance.toString();
  }

  async runWithdrawBalance(amount: any, contract_address: number ) {
    const _amount = utils.parseEther(amount);
    this.beforeProgressing();
    const BEPContract = contract_address == 721 ? await this.getBEP721Contract() : await this.getBEP20Contract();

    await BEPContract.methods
      .withdraw(_amount)
      .send({ from: this.getConnectedAccount() });

    Toast.fire({ icon: 'success', titleText: 'Success!' });
  }

  async disconnect() {
    if (this.provider) {
      await this.closeProvider();
      await this.Web3Modal.clearCachedProvider();
      this.provider = null;
    }
  }

  async getItemFromShop(itemId: any): Promise<any> {
    await this.fetchNftItemFromShop();
    let shop_item = null;
    for (let i = 0; i < this.shopList.length; i++) {
      var item = this.shopList[i];
      if (item['mrId'] == itemId) {
        shop_item = { ...item };
      }
    }
    this.shopItem = shop_item;
    return this.shopItem;
  }

  getShopitem(): Promise<any> {
    return this.shopItem;
  }

  getPrice(currency: any, price: any, flag: boolean = true): any {
    let p1 = parseFloat(window.web3.utils.fromWei(price + '', 'ether'))
      .toFixed(4)
      .toString();
    let p = parseFloat(p1);

    if (currency == environment.CURRENCY_BNB) {
      return p + (flag ? ' BNB' : '');
    } else if (currency == environment.CURRENCY_LPLT) {
      return p + (flag ? ' LPLT' : '');
    }
  }

  BigNumberToPlain(num: any) {
    var str = num.toString();
    var flag = str.indexOf('e+');
    var ret = '';
    if (flag < 0) {
      ret = str;
    } else {
      var str_arr = str.split('e+');
      var tmp_num1 = str_arr[0];
      var tmp_num2 = str_arr[1];
      var dot_arr = tmp_num1.split('.');
      var dot_length = dot_arr.length < 2 ? 0 : dot_arr[1].length;
      var zero_count = tmp_num2 - dot_length;
      var tmp_num =
        dot_arr.length > 1 ? dot_arr[0] + '' + dot_arr[1] : dot_arr[0];
      for (var i = 0; i < zero_count; i++) {
        tmp_num += '0';
      }
      ret = tmp_num;
    }
    console.log(ret, ret.length);
    return ret;
  }

  async isConected(): Promise<boolean> {
    window.web3 = this.getWeb3Obj(this.getCurrentProvider());
    let chain_id = await window.web3.eth.getChainId();
    let connectedAccount: any;
    if (/*chain_id === 3 || chain_id === 56 || */ chain_id === 97) {
      let accounts = await window.web3.eth.getAccounts();
      connectedAccount = accounts[this.accountIndex];
      if (connectedAccount && connectedAccount != '') {
        this.connectedAccount = connectedAccount;
        return true;
      }
    }

    return false;
  }

  async runWithdrawBalanceByUser(to: any, amount: any) {
    if (!to || !amount) return false;

    const bep20Contract = this.getBEP20Contract();
    let _etherPrice = utils.parseEther(amount.toString()).toString();

    await bep20Contract.methods
      .transfer(to, _etherPrice)
      .send({ from: this.getConnectedAccount() })
      .on('error', (err: any) => {
        Toast.fire({ icon: 'error', titleText: 'check the transfer address' });
      });
  }

  async getAccountNumber(): Promise<any> {
    window.web3 = this.getWeb3Obj(this.getCurrentProvider());
    let chain_id = await window.web3.eth.getChainId();
    let connectedAccount: any;

    if (/*chain_id === 3 || chain_id === 56 || */ chain_id === 97) {
      let accounts = await window.web3.eth.getAccounts();
      connectedAccount = accounts[this.accountIndex];

      return connectedAccount;
    }
    return '';
  }

  getConnectedAccount() {
    return this.connectedAccount;
  }

  async beforeProgressing() {
    if ((await this.isConected()) == false) {
      this.init();
      this.setWeb3Modal(this.getWeb3Modal());

      let providerObj;
      try {
        providerObj = await this.Web3Modal.connect();
        this.setProvider(providerObj);
      } catch (e) {
        Toast.fire({ icon: 'error', titleText: 'Failed connecting to wallet' });
        return;
      }
      await this.fetchAccountData();
    } else {
    }
  }

  async fetchAccountData() {
    let web3Obj = this.getWeb3Obj(this.getProvider());

    let chain_id = await web3Obj.eth.getChainId();
    if (/*chain_id === 3 || chain_id === 56 || */ chain_id === 97) {
      let accounts = await web3Obj.eth.getAccounts();
      this.connectedAccount = accounts[this.accountIndex];
      if (this.connectedAccount == undefined) {
        this.disconnect();
      } else {
      }
    } else {
      alert('Please connect with Binance Smart Chain net');
    }
  }

  async fetchNftItemFromShop(): Promise<any> {
    if (this.shopList && this.shopList.length > 0) return this.shopList;

    window.web3 = this.getWeb3Obj(this.getCurrentProvider());
    let chain_id = await window.web3.eth.getChainId();
    let connectedAccount: any;
    if (this.isConected) {
      let accounts = await window.web3.eth.getAccounts();
      connectedAccount = accounts[this.accountIndex];
    }

    const BEP721Contract = await this.getBEP721Contract();
    // const itemKindCount = await BEP721Contract.methods.getMrItemKindCount().call();
    // console.log("itemKindCount", itemKindCount);

    const uri = await BEP721Contract.methods.baseURI().call();
    ////setBaseURI(uri)

    let result = await BEP721Contract.methods.fetchItemFromShop().call();
    result = JSON.parse(result);

    var i = 0;
    // let id, name, rate, price, imageURI;
    let metaData: any = {
      data: {
        name: '',
        description: '',
        rate: 0,
        image: '',
        date: '',
        mrPrice: 0,
      },
    };
    for (i <= 0; i < result.length; i++) {
      metaData = await axios.get(uri + result[i].mrMetaDataURI);

      result[i].name = metaData.data.name;
      result[i].description = metaData.data.description;
      result[i].rate = metaData.data.rate;
      result[i].imageURI = metaData.data.image;
      result[i].date = metaData.data.date;
    }
    this.shopList = [...result];
    return this.shopList;
  }

  getBEP20Contract() {
    let contract = new window.web3.eth.Contract(
      bep20_contractABI,
      environment.REACT_APP_MR_BEP20_CONTRACT_ADDR
    );
    return contract;
  }

  getBEP721Contract() {
    let contract = new window.web3.eth.Contract(
      bep721_contractABI,
      environment.REACT_APP_MR_BEP721_CONTRACT_ADDR
    );
    return contract;
  }

  async purchaseItem(
    accountId: any,
    mrId: any,
    price: any,
    currency: any,
    count: any
  ) {
    if (count == '' || count == 0) {
      alert('Count Empty!');
      return;
    }

    const bep721Contract = this.getBEP721Contract();
    const bep20Contract = this.getBEP20Contract();
    if (currency == environment.CURRENCY_BNB) {
      await bep721Contract.methods
        .mintTokenByBNB(accountId, mrId, count)
        .send({
          from: accountId,
          value: price * count,
        })
        .on('receipt', (receipt: any) => {
          console.log(receipt);
        })
        .on('error', (err: any) => {
          console.log(err);
        });
    } else {
      let _etherPrice = utils
        .parseEther(
          (
            parseFloat(window.web3.utils.fromWei(price + '', 'ether')) * count
          ).toString()
        )
        .toString();
      await bep20Contract.methods
        .approve(environment.REACT_APP_MR_BEP721_CONTRACT_ADDR, _etherPrice)
        .send({ from: accountId });
      await bep721Contract.methods
        .mintTokenByLPLT(accountId, mrId, count)
        .send({
          from: accountId,
          value: 0,
        })
        .on('receipt', (receipt: any) => {
          console.log(receipt);
        })
        .on('error', (err: any) => {
          console.log(err);
        });
    }
  }

  async getUserTotalRate(address: any) {
    const BEP721Contract = await this.getBEP721Contract();
    const totalRate = await BEP721Contract.methods
      .getUserTotalRate(address)
      .call();
    return totalRate;
  }

  async getBuyDexRate(routerContract: any) {
    const _buyDexRate = await routerContract.methods.getBuyDexRate().call();
    return _buyDexRate;
  }

  async getSellDexRate(routerContract: any) {
    const _sellDexRate = await routerContract.methods.getSellDexRate().call();
    return _sellDexRate;
  }

  async fetchUserInventory(address: any) {
    let _totalRate = await this.getUserTotalRate(address);
    console.log('>>>totoal rate:', _totalRate);

    const BEP721Contract = await this.getBEP721Contract();
    let result = await BEP721Contract.methods
      .fetchUserInventory(address)
      .call();
    result = JSON.parse(result);

    let metaData = {
      data: {
        name: '',
        description: '',
        rate: 0,
        thumb: '',
        date: '',
        mrPrice: 0,
        image: '',
      },
    };
    for (let i = 0; i < result.length; i++) {
      metaData = await axios.get(result[i].metaDataURI);
      result[i].name = metaData.data.name;
      result[i].description = metaData.data.description;
      result[i].rate = metaData.data.rate;
      result[i].imageURI = metaData.data.image;
    }

    return {
      totalRate: _totalRate,
      result: result,
    };
  }

  async setNftItemSellSate(tokenId: any, state: any, price: any) {
    const BEP721Contract = await this.getBEP721Contract();
    const tokenPrice = utils.parseEther(price.toString());
    const tokenState = state == '0' ? 1 : 0;
    const res = await BEP721Contract.methods
      .setUserNftSellState(tokenId, tokenPrice, tokenState)
      .send({
        from: this.getConnectedAccount(),
      });
  }

  async setShopItem(mrId: any, type: any, value: any) {
    await this.beforeProgressing();
    const BEP721Contract = await this.getBEP721Contract();

    switch (type) {
      case 1: // name
        await BEP721Contract.methods.setMrName(mrId, value).send({
          from: this.getConnectedAccount(),
        });
        break;
      case 2: // rate
        await BEP721Contract.methods.setMrRate(mrId, value).send({
          from: this.getConnectedAccount(),
        });
        break;
      case 3: // price
        await BEP721Contract.methods.setMrPrice(mrId, value).send({
          from: this.getConnectedAccount(),
        });
        break;
      case 4: // meta data
        await BEP721Contract.methods.setMrMetaDataURI(mrId, value).send({
          from: this.getConnectedAccount(),
        });
        break;
      case 5: // count
        await BEP721Contract.methods.setMrMaxCount(mrId, value).send({
          from: this.getConnectedAccount(),
        });
        break;
      case 6: // currency
        await BEP721Contract.methods.setMrCurrencyKind(mrId, value).send({
          from: this.getConnectedAccount(),
        });
        break;
    }
    Toast.fire({ icon: 'success', titleText: 'Successfully Set' });
  }

  async fetchItemFromMarketPlace() {
    window.web3 = this.getWeb3Obj(this.getCurrentProvider());
    const BEP721Contract = await this.getBEP721Contract();

    let result = await BEP721Contract.methods.fetchItemFromMarketPlace().call();
    result = JSON.parse(result);

    let metaData: any = {};
    for (let i = 0; i < result.length; i++) {
      metaData = await axios.get(result[i].mrMetaDataURI);
      result[i].name = metaData.data.name;
      result[i].description = metaData.data.description;
      result[i].rate = metaData.data.rate;
      result[i].imageURI = metaData.data.image;
    }
    return result;
  }

  async handleBuy(tokenId: any, price: any) {
    const BEP721Contract = await this.getBEP721Contract();
    await BEP721Contract.methods
      .buyItemFromMarketPlace(tokenId)
      .send({
        from: this.getConnectedAccount(),
        value: price,
      })
      .on('receipt', (receipt: any) => {
        alert('Buy Success');
      })
      .on('error', (err: any) => {});
  }

  async buyLPLT(buyLpltAmount: any) {
    this.beforeProgressing();
    const _amount = utils.parseEther(buyLpltAmount);
    const BEP721Contract = await this.getBEP721Contract();
    await BEP721Contract.methods
      .buyLPLT()
      .send({ from: this.getConnectedAccount(), value: _amount });

    Toast.fire({ icon: 'success', titleText: 'Successfully buy' });
  }

  async sellLPLT(sellLpltamount: any) {
    this.beforeProgressing();
    const _amount = utils.parseEther(sellLpltamount).toString();
    const BEP721Contract = await this.getBEP721Contract();
    await BEP721Contract.methods
      .sellLPLT(_amount)
      .send({ from: this.getConnectedAccount() });

    Toast.fire({ icon: 'success', titleText: 'Successfully sell' });
  }
}
