import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  constructor(
    private apiService: ApiService,
  ) { }


  create(tournament) {
    return this.apiService.post('/admin/tournament-management/', tournament);
  }

  getAll(page = 1, limit = 10, query = {}) {
    return this.apiService.post(`/admin/tournament-management/all`, { page: page, limit: limit, query: query });
  }

}
