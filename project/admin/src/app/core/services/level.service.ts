import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LevelService {


  constructor(
    private apiService: ApiService,
  ) { }


  create(level) {
    return this.apiService.post('/admin/level-management/', level);
  }

  getAll(page = 1, limit = 10, query = {}) {
    return this.apiService.post(`/admin/level-management/all`, { page: page, limit: limit, query: query });
  }

  update(id, level) {
    return this.apiService.put(`/admin/level-management/${id}`, level);
  }

  delete(id) {
    return this.apiService.delete(`/admin/level-management/${id}`);
  }

}
