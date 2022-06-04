import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from 'src/app/core/services/web3.service';

let bep20_contractABI = require('../../contracts/bep20-contract-abi.json');
let bep721_contractABI = require('../../contracts/bep721-contract-abi.json');
let router_contractABI = require('../../contracts/bepRouter-contract-abi.json');

@Component({
  selector: 'app-nftdefault',
  templateUrl: './nftdefault.component.html',
  styleUrls: ['./nftdefault.component.css'],
})
export class NFTDefaultComponent implements OnInit {
  constructor(private router: Router, private web3Service: Web3Service) {}

  nftItems = [];
  nftItem = {};

  manageYours = true;
  display = 'none';
  isLoader = false;
  connectedAccount = '';
  connectedLabel = 'Connect Wallet';

  ngOnInit(): void {
    this.fetchItemMarketPlace();
  }

  async fetchItemMarketPlace(): Promise<any>{ 
    await this.web3Service.AddTokenInWallet()
    this.nftItems = await this.web3Service.fetchNftItemFromShop();
    console.log(this.nftItems, "nft items" );
  }

  SelectDetails(id: number) {
    this.router.navigate(['/nft/details/', id]);
  }
}
