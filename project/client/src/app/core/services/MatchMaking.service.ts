import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root'
})
export class MatchMakingService {

  constructor( private apiService: ApiService,private socketService: SocketService
  ) { }

  // get solo match request
  getSoloMatch() {
    return this.apiService.get(`/matchFinding/solo/`);
  }
  // solo match Request
  soloMatch(soloInfo: any) {
    return this.apiService.post(`/matchFinding/solo/`, soloInfo);
  }
  acceptSoloMatch(matchId: string) {
    return this.apiService.get(`/matchFinding/solo/accept/${matchId}`, );
  }
  getSoloEvent(userId: string) {
    return this.socketService.onEvent('SoloMatchFound'+userId)
  }

  teamMatch(matchInfo: any) {
    return this.apiService.post(`/matchFinding/team`, matchInfo);
  }

  // returns Team mates for 5v5
  getTeamMates() {
    return this.apiService.get(`/matchFinding/getTeamMates`);
  }



  // 5v5 request
  invite5v5(id: string, body: any) {
    return this.apiService.put(`/matchFinding/invite/5v5/${id}`, body);
  }
  create5v5Lobby(body: any) {
    return this.apiService.post(`/matchFinding/lobby/5v5`, body);
  }
  get5v5Lobby(id: string) {
    return this.apiService.get(`/matchFinding/lobby/5v5/${id}`);
  }
  accept5v5Lobby(id: string) {
    return this.apiService.get(`/matchFinding/invite/5v5/accept/${id}`);
  }
}
