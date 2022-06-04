import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(private apiService: ApiService) { }

  getTransactions(page, limit) { return this.apiService.get(`/admin/trade/transaction?page=${page}&limit=${limit}`);}

  getP2PPost(page, limit) { return this.apiService.get(`/admin/trade/p2p?page=${page}&limit=${limit}`);}


}
