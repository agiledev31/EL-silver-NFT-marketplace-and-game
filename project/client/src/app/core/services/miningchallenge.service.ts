import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MiningChallengeService {


  constructor(
    private apiService: ApiService,
  ) { }

  getAll(page = 1, limit = 10, query = {}) {
    return this.apiService.post(`/admin/mining-challenge/all`, { page: page, limit: limit, query: query });
  }

}
