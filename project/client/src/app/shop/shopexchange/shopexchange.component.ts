import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Web3Service } from 'src/app/core/services/web3.service';
import { Toast } from 'src/app/_constants/SwalToast';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-shopexchange',
  templateUrl: './shopexchange.component.html',
  styleUrls: ['./shopexchange.component.css'],
})
export class ShopExchangeComponent implements OnInit { 
  isLoader = false;
  exchangeOrder = true
  fromAmount: any = ''
  toAmount: any = ''

  buyDexRate = 10000;
  sellDexRate = 12000;

  constructor(
    private route: ActivatedRoute,
    private web3Service: Web3Service
  ) {}

  ngOnInit(): void {
    this.initLPLT()
  }

  switchExchage(){
    this.exchangeOrder = !this.exchangeOrder
    this.fromAmount = ''
    this.toAmount = ''
  }

  async initLPLT(){
    await this.web3Service.beforeProgressing();
    this.buyDexRate = await this.web3Service.getBuyDexRate(this.web3Service.getBEP20Contract());
    this.sellDexRate = await this.web3Service.getSellDexRate(this.web3Service.getBEP20Contract());
  }

  updateFromAmount(){
    let rate = this.exchangeOrder ? this.buyDexRate : this.sellDexRate
    this.toAmount = this.calculatePrice(this.fromAmount, rate, this.exchangeOrder )
  }

  updateToAmount(){
    let rate = !this.exchangeOrder ? this.buyDexRate : this.sellDexRate
    this.fromAmount = this.calculatePrice(this.toAmount, rate, this.exchangeOrder )
  }

  calculatePrice(amount: number, rate: number, flag: boolean ){
    if (flag ){
      return parseFloat((amount * rate) + "") ;
    }else{
      return parseFloat(parseFloat((amount / rate) + "").toFixed(4).toString());
    }
  }

  purchaseToken(){
    if (this.exchangeOrder ){
      this.buyLPLT(this.fromAmount)
    }else{
      this.sellLPLT(this.fromAmount )
    }
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
}
