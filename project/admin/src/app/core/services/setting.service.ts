import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private apiService: ApiService) { }

  getAll() {
    return this.apiService.get(`/admin/setting-management/all`);
  }

  update(id, setting) {
    return this.apiService.put(`/admin/setting-management/update/${id}`, setting);
  }


}
