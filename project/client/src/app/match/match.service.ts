import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ApiService } from '../core';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

  public matchType = new BehaviorSubject(0);
  constructor(private apiService: ApiService,) {

    let type = window.localStorage['matchType'];
    console.log('type', type)
    this.matchType.next(type ? type : 0);
  }
  setType(type: number) {
    this.matchType.next(type);
    window.localStorage['matchType'] = type;
  }
  exit() {
    window.localStorage.removeItem('matchType');
  }
  getFriendsAndRecentlyPlayedWith() { return this.apiService.get(`/match/friends/recently-played`); }
  createMatch(team : any, type: number) { return this.apiService.post(`/match/create`, {team, type}); }

  getMatchDetails(id: any) {
    return this.apiService.get(`/match/${id}`);
  }

  my(page = 1, limit = 10, query = {}) {
    return this.apiService.post(`/match/my`, { page: page, limit: limit, query: query });
  }

  update(id: any, match: any) {
    return this.apiService.put(`/match/${id}`, match);
  }


}
