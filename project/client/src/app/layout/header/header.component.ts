import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/core';
import { NotificationService } from 'src/app/core/services/notification.service';
import { Web3Service } from 'src/app/core/services/web3.service';
import { environment } from 'src/environments/environment';
import axios from 'axios';

let bep20_contractABI = require('../../contracts/bep20-contract-abi.json');
let bep721_contractABI = require('../../contracts/bep721-contract-abi.json');
let router_contractABI = require('../../contracts/bepRouter-contract-abi.json');

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  header = true;
  headerGrey = false;
  isAuth = true;
  isLogin = false;
  isSign = false;
  userHeaderService: Subscription = new Subscription();
  currentUser = null;

  // web3modal variables
  // web3Modal: any;
  connectedAccount = '';
  connectedLabel = 'Connect Wallet';

  public isMenuCollapsed = true;
  constructor(
    private router: Router,
    private userService: UserService,
    private web3Service: Web3Service
  ) {
    this.userHeaderService = this.userService.currentUser.subscribe(
      (userData) => {
        this.currentUser = userData as any;
      }
    );
    router.events.subscribe((e) => {
      this.isAuth = router.url.includes('auth');
      this.isLogin = router.url.includes('auth/login');
      this.isSign = router.url.includes('auth/signup');

      if (router.url == '/') {
        this.header = true;
        this.headerGrey = false;
      } else if (router.url.includes('auth')) {
        this.header = false;
        this.headerGrey = false;
      } else {
        this.header = false;
        this.headerGrey = true;
      }
    });
  }

  ngOnInit(): void {}
  onLogoutClick() {
    this.userService.purgeAuth();
    this.router.navigate(['/auth']);
  }

  ngOnDestroy() {
    this.userHeaderService.unsubscribe();
  }

  initWalletConnect() {
    this.web3Service.init();
    this.web3Service.getWeb3Modal()
    //this.web3Service.setWeb3Modal(this.web3Service.getWeb3Modal());
    //this.web3Modal = web3ModalObj;
  }

  async connectWallet() {
    this.initWalletConnect();

    let providerObj;
    try {
      providerObj = await this.web3Service.Web3Modal.connect();
      this.web3Service.setProvider(providerObj);
    } catch (e) {
      console.log('Could not get a wallet connection', e);
      return;
    }
    providerObj.on('accountsChanged', (accounts: any) => {
      console.log(`accountsChanged = ${accounts}`);
      this.fetchAccountData();
    });
    providerObj.on('chainChanged', (chain_id: any) => {
      console.log(`chainChanged ${chain_id}`);
    });

    providerObj.on('disconnect', (error: any) => {
      console.log(`disconnect ${error}`);
      this.onDisconnect();
    });

    this.fetchAccountData();
  }

  async onDisconnect() {
    this.web3Service.disconnect();
    this.connectedLabel = 'Connect Wallet';
  }

  async fetchAccountData() {
    let web3Obj = this.web3Service.getWeb3Obj(this.web3Service.getProvider());

    let chain_id = await web3Obj.eth.getChainId();
    if (this.web3Service.isChained(chain_id)) {
      let accounts = await web3Obj.eth.getAccounts();
      this.connectedAccount = accounts[0];
      if (this.connectedAccount == undefined) {
        this.onDisconnect();
      } else {
        this.connectedLabel = 'Connected : ' + this.connectedAccount;        
      }
    } else {
      //setConnected(false);
      alert('Please connect with Binance Smart Chain net');
    }
  }
}
