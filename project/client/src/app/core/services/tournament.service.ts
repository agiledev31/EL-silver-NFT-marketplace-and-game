import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor(
    private apiService: ApiService,
  ) { }

  get(id: any) {
    return this.apiService.get(`/tournament/${id}`);
  }

  getAll(page = 1, limit = 8, query = {}) {
    return this.apiService.post(`/tournament/all`, { page: page, limit: limit, query: query });
  }

  getAllSearch(page = 1, limit = 8, query = {}) {
    return this.apiService.post(`/tournament/search`, { page: page, limit: limit, query: query });
  }
  signUp(id:string, body:any) {
    return this.apiService.post(`/tournament/join/${id}`, body);
  }

  confirmInvitePayment(id:string) {
    return this.apiService.get(`/tournament/invite/${id}`);
  }
}
