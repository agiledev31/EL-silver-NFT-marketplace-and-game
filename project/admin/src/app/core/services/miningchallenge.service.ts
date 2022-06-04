import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MiningChallengeService {


  constructor(
    private apiService: ApiService,
  ) { }


  create(challenge) {
    return this.apiService.post('/admin/mining-challenge/', challenge);
  }

  getAll(page = 1, limit = 10, query = {}) {
    return this.apiService.post(`/admin/mining-challenge/all`, { page: page, limit: limit, query: query });
  }

  update(id, challenge) {
    return this.apiService.put(`/admin/mining-challenge/${id}`, challenge);
  }

  delete(id) {
    return this.apiService.delete(`/admin/mining-challenge/${id}`);
  }

}
