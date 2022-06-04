import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class LolChallengeService {

  constructor(
    private apiService: ApiService,
  ) { }

  fetchRunningChallenge() {
    return this.apiService.get(`/lolchallenge`);
  }

  fetchIfEngagedinChallenge(username: string, region: string){

    return this.apiService.post(`/lolchallenge/checkEngageStatus`, { username: username, region: region, });
  }

  createNewChallenge(username: string,region : string,)
  {
    return this.apiService.post(`/lolchallenge/createNewChallenge`,{ username: username, region: region,});
  }

  getGameData(username: string,region : string, minutes: number,)
  {
    return this.apiService.post(`/lolchallenge/getGameData`,{ username: username, region: region, minutes: minutes, });
  }

  endChallenge(challengeId:string, body:any) {
    console.log("body",body)
    if(body.games.length==0){
      return this.apiService.post(`/lolchallenge/emptysubmission/${challengeId}`, body);
    }
    else{
      return this.apiService.post(`/lolchallenge/submission/${challengeId}`, body);
    }
  }

  getAll(page = 1, limit = 8, query = {}) {
    return this.apiService.post(`/lolchallenge/all`, { page: page, limit: limit, query: query });
  }

  getlaplatastats(){
    return this.apiService.get('/lolchallenge/getlaplata');
  }

  getAllChallenges(qParams:any) {
    return this.apiService.get('/admin/lol-challenge', qParams);
  }


  getAnnouncements(page = 1, limit = 3) { return this.apiService.get(`/admin/announcement/all?page=${page}&limit=${limit}`); }

  fetchChallengeHistory(qParams?: any, userID?: string) {
    if (userID){
      return this.apiService.get(`/lolchallenge/submission/` + userID);
    }else{
      return this.apiService.get(`/lolchallenge/submission`, qParams);
    }
  }

  fetchRewards() {
    return this.apiService.get('/lolchallenge/rewards');
  }

  getWithdrawals(qParams: any) {
    return this.apiService.get('/withdraw', qParams);
  }

  validateAddress(address: string) {
    console.log(address)
    return this.apiService.post('/withdraw/validateAddress', {address});
  }

  createWithdrawal(method: string, status: string, amount: number, address: string) {
    return this.apiService.post('/withdraw/transaction', { method, status, amount, address} );
  }

  getStatistics() {
    return this.apiService.get('/lolchallenge/statistics');
  }

  getleaderboard(page?: number, limit?: number) {
    if ( page && limit){
      return this.apiService.get('/leaderboard/all?page=' + page + '&limit=' + limit);
    } else{
      return this.apiService.get('/leaderboard');
    }
  }

  getPagedleaderboard(page?: number) {
    if (page){
      return this.apiService.get('/leaderboard/all?page=' + page);
    } else{
      return this.apiService.get('/leaderboard/all?page=' + 1);
    }
  }
  getMiningChallengeLeaderboard(page?: number,data?:any) {
    if (page){
      return this.apiService.post('/leaderboard/miningchallenge?page=' + page, data);
    }else{
      return this.apiService.post('/leaderboard/miningchallenge?page=' + 1, data);
    }
  }

}
