import { Injectable } from '@angular/core';
import { ConstantData } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  regions: ConstantData[] = [];
  tournamentStatus: ConstantData[] = [];

  constructor(
    private apiService: ApiService,
  ) {
    this.getTournamentStatus();

  }

  getRegions() {
    this.apiService.get('/constants/region').subscribe((res: any) => {
      if (res.status === 200)
        this.regions = res.data.regions;
    })
  }

  getTournamentStatus() {
    this.apiService.get('/constants/tournamentStatus').subscribe((res: any) => {
      if (res.status === 200)
        this.tournamentStatus = res.data.status;
    })
  }



}
