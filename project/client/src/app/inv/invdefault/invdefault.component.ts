import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Web3Service } from 'src/app/core/services/web3.service';
import { environment } from 'src/environments/environment'; 
import { Toast } from 'src/app/_constants/SwalToast';

@Component({
  selector: 'app-invdefault',
  templateUrl: './invdefault.component.html',
  styleUrls: ['./invdefault.component.css'],
})
export class InvDefaultComponent implements OnInit {
  constructor(private router: Router, private web3Service: Web3Service) {
    this.fetchInventory();
  }

  manageYours = true;
  display = 'none';
  total_mining_rate = 0;
  isLoader = false;
  inventItems = [];
  showInventItems:any = [];
  connectedAccount = '';
  connectedLabel = 'Connect Wallet';
  inventories:any = [];
  sellItemPrice = 0;
  
  total_page = 1;
  now_page = 1;
  page_size = 10;

  inventItem = {
    'description': "",
    'imageURI': "",
    'itemId': 0,
    'metaDataURI': "",
    'name': "",
    'price': 0,
    'rate': 0,
    'tokenId': "",
    "tokenSellState": ""
  }

  item_state_on = "<div class='item-state-on'>On</div>";
  item_state_off = "<div class='item-state-off'>Off</div>";
  forCart = true

  ngOnInit(): void {
  }

  async fetchInventory() {
    await this.web3Service.beforeProgressing();

    let result = await this.web3Service.fetchUserInventory(
      this.web3Service.connectedAccount
    );
    this.total_mining_rate = result.totalRate;
    this.inventories = result.result;

    this.total_page = Math.ceil(this.inventories.length / this.page_size);
    this.showItems();
  }

  showItems() {
    let start = (this.now_page - 1) * this.page_size;
    let end = start + this.page_size - 1;
    end = end > this.inventories.length - 1 ? this.inventories.length - 1 : end;
    this.showInventItems = [];
    for (var i = start; i <= end; i++) {
      this.showInventItems.push(this.inventories[i] );
    }
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

  show2(){
    this.forCart = !this.forCart
  }

  onCloseHandled() {
    this.display = 'none';
  }

  SelectDetails(tokenId: any) {
    let tmp_item = {...this.inventItem }

    for (var i = 0; i < this.inventories.length; i++) {
      tmp_item = this.inventories[i];
      if (tokenId == tmp_item.tokenId) {
        this.sellItemPrice = this.web3Service.getPrice(environment.CURRENCY_BNB, tmp_item.price, false )
        this.inventItem = { ...tmp_item };
      }
    }
    this.display = 'block';
  }

  async clickInvAction(){
    var decimalOnly = /^\s*-?[0-9]\d*(\.\d{1,2})?\s*$/;
    if (!decimalOnly.test(this.sellItemPrice.toString() )){
      Toast.fire({ icon: 'error', titleText: 'Number Validation Error' });
      return;
    }

    if (await this.web3Service.beforeProgressing() == false ) return;

    this.isLoader = true;
    await this.web3Service.setNftItemSellSate(this.inventItem.tokenId, this.inventItem.tokenSellState, this.sellItemPrice )
    await this.fetchInventory();
    this.display = 'none';
    this.isLoader = false; 
  }
}
