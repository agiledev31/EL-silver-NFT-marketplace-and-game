import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LolChallengeService {
  constructor(private apiService: ApiService) {}

  getLaplataSettings() {
    return this.apiService.get('/admin/lol-challenge/laplata-settings');
  }

  updateLaplataSettings(perDayDistribution: string, hardCap: string, incentive: string, minwithdrawal:string) {
    return this.apiService.put('/admin/lol-challenge/laplata-settings', {
      perDayDistribution,
      hardCap,
      incentive,
      minwithdrawal
    });
  }

  getAllChallenges(qParams) {
    console.log("qq",qParams);

    return this.apiService.get('/admin/lol-challenge', qParams);
  }

  search(searchText, qParams) {
    return this.apiService.get(
      '/admin/lol-challenge/search/' + searchText,
      qParams
    );
  }

  getUserChallengehistory(userId) {
    return this.apiService.get('/admin/lol-challenge/' + userId);
  }

  // Karan Working
  getWithdrawals(qParams) {
    return this.apiService.get('/admin/withdraws', qParams);
  }

  getAllWithdrawals() {
    return this.apiService.get('/admin/withdraws/all');
  }
  getAllRefund() {
    return this.apiService.get('/admin/withdraws/downloadRefunded');
  }
  getAllCancelled() {
    return this.apiService.get('/admin/withdraws/downloadCancelled');
  }
  getAllComplete() {
    return this.apiService.get('/admin/withdraws/downloadComplete');
  }
  changeStatus(ids, changeStatus) {
    return this.apiService.patch('/admin/withdraws', {
      withdrawals: ids,
      status: changeStatus,
    });
  }

  makerefunds(ids, changeStatus) {
    console.log('inside api service for refund', ids);
    return this.apiService.post('/admin/withdraws/refund', {
      withdrawals: ids,
      status: changeStatus,
    });
  }
}
