import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class Web3Service {
    providerOptions: object = {
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

    Web3: any;
    Web3Modal: any;
    WalletConnectProvider: any;

    constructor() { }

    init(): void{
        this.Web3 = this.Web3 | window.Web3.default;
        this.Web3Modal = this.Web3Modal | window.Web3Modal.default;
        this.WalletConnectProvider = this.WalletConnectProvider | window.WalletConnectProvider.default;
    }
}