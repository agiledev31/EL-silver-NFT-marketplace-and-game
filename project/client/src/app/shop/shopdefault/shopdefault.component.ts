import { Component, OnInit } from '@angular/core';
import { Event, Router } from '@angular/router';
import { Web3Service } from 'src/app/core/services/web3.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

let bep20_contractABI = require('../../contracts/bep20-contract-abi.json');
let bep721_contractABI = require('../../contracts/bep721-contract-abi.json');
let router_contractABI = require('../../contracts/bepRouter-contract-abi.json');

@Component({
  selector: 'app-shopdefault',
  templateUrl: './shopdefault.component.html',
  styleUrls: ['./shopdefault.component.css'],
})
export class ShopDefaultComponent implements OnInit {
  //Web3Modal = window.Web3Modal.default;
  //WalletConnectProvider = window.WalletConnectProvider.default;
  //provider: any;
  buyDexRate = 10000;
  sellDexRate = 12000;
  buyLpltAmount = 0;
  sellLpltAmount = 0;
  isLoader = false;

  constructor(private router: Router, public web3Service: Web3Service) {
    this.fetchNftItemFromShop();
    this.initLPLT();
  }

  inventItems = [];

  ngOnInit(): void {}
  SelectDetails(id: number) {
    this.router.navigate(['/shop/details/', id]);
  }

  // web3modal variables
  // web3Modal: any;
  connectedAccount = '';
  connectedLabel = 'Connect Wallet';

  /*handleValidate(event: Event ){ 
    let keyCode = event.keyCode;
    let value = event.target.value;

    if (keyCode == 190 ){
      if (value.indexOf(".") > -1 ){
        event.target.value = value.substring(0, value.length - 1 )
      }
    }else if(keyCode < 48 || keyCode > 57 ){
      event.target.value = value.substring(0, value.length - 1 )
    }
  }*/

  async fetchNftItemFromShop() : Promise<any> {
    window.web3 = this.web3Service.getWeb3Obj(
      this.web3Service.getCurrentProvider()
    );
    const BEP721Contract = await this.getBEP721Contract();

    const uri = await BEP721Contract.methods.baseURI().call();

    let result = await BEP721Contract.methods.fetchItemFromShop().call();
    result = JSON.parse(result);

    var i = 0;
    // let id, name, rate, price, imageURI;
    let metaData = {data: {name: "", description: "", rate: 0, thumb: "", date: "", mrPrice: 0}};
    for (i <= 0; i < result.length; i++) {
      
      metaData = await axios.get(uri + result[i].mrMetaDataURI);
      result[i].name = metaData.data.name;
      result[i].description = metaData.data.description;
      result[i].rate = metaData.data.rate;
      result[i].imageURI = metaData.data.thumb;
      result[i].date = metaData.data.date;
      result[i].price = this.web3Service.getPrice(result[i].currency, result[i].mrPrice );
    }
    console.log(result, "shop result");
    this.inventItems = result ;
  }

  async buyLPLT(buyLpltAmount: any ): Promise<any> {
    let result = await this.web3Service.beforeProgressing();
    if (!result ){
      return false;
    }
    this.isLoader = true;
    try{
      await this.web3Service.buyLPLT(buyLpltAmount );
    }catch{
      this.isLoader = false;
    }

    this.isLoader = false;
  }

  async sellLPLT(sellLpltAmount: any ): Promise<any> {
    let result = await this.web3Service.beforeProgressing();
    if (!result ) return;
    this.isLoader = true;
    try{
      await this.web3Service.sellLPLT(sellLpltAmount );
    }catch{
      this.isLoader = false;
    }
    this.isLoader = false;
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

  
  async initLPLT(){
    this.buyDexRate = await this.web3Service.getBuyDexRate(this.web3Service.getBEP20Contract());
    this.sellDexRate = await this.web3Service.getSellDexRate(this.web3Service.getBEP20Contract());
  }

  calculatePrice(amount: number, rate: number, flag: boolean ){
    if (flag ){
      return parseFloat((amount * rate) + "") ;
    }else{
      return parseFloat(parseFloat((amount / rate) + "").toFixed(4).toString());
    }
  }
}
