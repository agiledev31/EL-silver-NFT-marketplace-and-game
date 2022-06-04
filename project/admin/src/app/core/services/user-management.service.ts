import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {


    constructor(private apiService: ApiService,) { }

  list( filter: any)
  {
    console.log(filter);
    let res = this.apiService.post('/admin/user-management/list', {filter});
    //console.log("res in api",res);
    return res;
  }

  getUserChallengehistory(qparams:any) {
    console.log(qparams);
    return this.apiService.post('/admin/lol-challenge/' + qparams.userId, { qparams});
  }
  getUserChallengeStatshistory(qparams:any) {
    console.log(qparams);
    return this.apiService.get('/admin/lol-challenge/statistics/' + qparams.userId );
  }


  createUser( user: any) { return this.apiService.post('/admin/user-management/create', {user});}
  updateStatus(user: any) { return this.apiService.post('/admin/user-management/update/status', {user});}
  updateProfile(user: any) { return this.apiService.post('/admin/user-management/update/profile', {user});}
  updatePassword(user: any) { return this.apiService.post('/admin/user-management/update/password', {user});}
}
