import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from './../../../environments/environment';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class TradeService {
  private currentSilverSubject = new BehaviorSubject<any>(null);
  public currentSilver = this.currentSilverSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    private socketService: SocketService,
  ) { }
  getP2PEvent(p2pTradeId: string){ return this.socketService.onEvent('p2pTrade'+p2pTradeId); }

  getSilver() {
    return this.httpClient.get('https://www.goldapi.io/api/XAG/USD/',{
      headers: {
        "x-access-token" : environment.goldApiServerKey
      },
      observe: 'response'
    });
  }

  populateSilver() {
    this.getSilver().subscribe(res => {
      if(res.status === 200) {
        this.currentSilverSubject.next(res.body);
      }
    })
  }
  sendSilverToFriend(friends:any) {return this.apiService.post('/trade/silver/sendSilverFriend', {friends});}
  instantBuyTrade(instantTrade: any) {return this.apiService.post('/trade/silver/instant/buy', {instantTrade});}
  instantSellTrade(instantTrade: any) {return this.apiService.post('/trade/silver/instant/sell', {instantTrade});}
  getTransactions(filter: any) {return this.apiService.post('/trade/silver/transactions', filter);}
  createP2PPost(post: any) {return this.apiService.post('/trade/silver/p2p/post', post);}
  updateP2PTrade(post: any, postId: string) {return this.apiService.put(`/trade/silver/p2p/post${postId}`, post);}
  getP2PTradeById(postId: string) {return this.apiService.get(`/trade/silver/p2p/post/${postId}`);}
  getP2PTrades(params: any) {return this.apiService.post(`/trade/silver/p2p/getAll`, params);}
  updateP2PTradeRequestOpen(request: any,id: string) {return this.apiService.put(`/trade/silver/p2p/open-request/${id}`, request);}
  updateP2PTradeRequestStatus(body: any,tradeId: string, requestId: string) {return this.apiService.put(`/trade/silver/p2p/post/${tradeId}/request/${requestId}`, body);}

  redeemVoucher(voucher: string) {return this.apiService.get(`/trade/silver/redeem/${voucher}`);}
}
