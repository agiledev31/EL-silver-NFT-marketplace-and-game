import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class VoucherService {
  constructor(private apiService: ApiService) { }

  getAll(page, limit) { return this.apiService.get(`/admin/voucher/all?page=${page}&limit=${limit}`);}

  getById(id) { return this.apiService.get(`/admin/voucher/${id}`);}

  update(id, voucher) { return this.apiService.put(`/admin/voucher/${id}`, voucher);}

  create(voucher) { return this.apiService.post(`/admin/voucher/`, voucher);}

  delete(id) { return this.apiService.delete(`/admin/voucher/${id}`);}

}
