import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '../core';

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {

  constructor(private http: HttpClient, private apiService: ApiService,
  ) { }


  // solo match Request
  soloMatch(soloInfo: any) {
    return this.apiService.post(`/matchFinding/solo/`, soloInfo);
  }

  teamMatch(matchInfo: any) {
    return this.apiService.post(`/matchFinding/team`, matchInfo);
  }

  // returns Team mates for 5v5
  getTeamMates() {
    return this.apiService.get(`/matchFinding/getTeamMates`);
  }

}
