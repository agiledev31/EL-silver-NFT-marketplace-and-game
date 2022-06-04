import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class AnnouncementService {
    constructor(private apiService: ApiService) { }

    getAll(page, limit) { return this.apiService.get(`/admin/announcement/all?page=${page}&limit=${limit}`); }

    getById(id) { return this.apiService.get(`/admin/announcement/${id}`); }

    update(id, announcement) { return this.apiService.put(`/admin/announcement/${id}`, announcement); }

    create(announcement) { return this.apiService.post(`/admin/announcement/`, announcement); }

    delete(id) { return this.apiService.delete(`/admin/announcement/${id}`); }

}