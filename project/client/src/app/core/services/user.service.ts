import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs';

import { ApiService } from './api.service';
import { JwtService } from './jwt.service';
import { User } from '../models';
import { map, distinctUntilChanged } from 'rxjs/operators';
import { SocketService } from './socket.service';

@Injectable()
export class UserService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();

  constructor(
    private apiService: ApiService,
    private jwtService: JwtService,
    private socketService: SocketService
  ) {}
  getCurrentUser(): any {
    return this.currentUserSubject.value;
  }

  getCheckAuth(): any {
    return this.isAuthenticatedSubject;
  }

  // Verify JWT in local storage with server & load user's info.
  // This runs once on application startup.
  populate() {
    // If JWT detected, attempt to get & store user's info
    if (this.jwtService.getToken()) {
      this.apiService.get('/user/context').subscribe(
        (res: any) => {
          console.log('in populate', res);
          if (res.status === 200) {
            this.setAuth(res.data.user);
            this.getUserEvent(res.data.user._id).subscribe((arg) =>
              this.populate()
            );
          }
        },
        (err) => this.purgeAuth()
      );
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  getUserEvent(userId: string) {
    return this.socketService.onEvent('user' + userId);
  }
  setAuth(user: User) {
    // Save JWT sent from server in local storage
    this.jwtService.saveToken(user.token);
    // Set current user data into observable
    this.currentUserSubject.next(user);
    // Set isAuthenticated to true
    this.isAuthenticatedSubject.next(true);
    //store in sessionStorage
    sessionStorage.setItem('authdata', JSON.stringify(user));
  }

  purgeAuth() {
    // Remove JWT from local storage
    this.jwtService.destroyToken();
    // Set current user to an empty object
    this.currentUserSubject.next(null);
    // Set auth status to false
    this.isAuthenticatedSubject.next(false);
    //remove from sessionStorage
    sessionStorage.removeItem('authdata');
  }

  update(user: any) {
    return this.apiService.put('/users', { user });
  }

  loginEmail(user: any): Observable<User> {
    return this.apiService.post('/users/login/email', { user });
  }
  loginPhone(user: any): Observable<User> {
    return this.apiService.post('/users/login/phone', { user });
  }

  loginGoogle(user: any): Observable<User> {
    return this.apiService.post('/users/login/google', { user });
  }

  signUpEmail(user: any): Observable<User> {
    return this.apiService.post('/users/register/email', { user });
  }

  signUpPhone(user: any): Observable<User> {
    return this.apiService.post('/users/register/phone', { user });
  }

  verify(user: any): Observable<User> {
    return this.apiService.post('/users/verify', { user });
  }
  verifyResend(user: any): Observable<User> {
    return this.apiService.post('/users/verify/resend', { user });
  }
  resetPassword(user: any): Observable<User> {
    return this.apiService.post('/users/reset/password', { user });
  }
  updateProfile(user: any) {
    return this.apiService.post('/update/profile', { user });
  }
  updatePassword(user: any) {
    return this.apiService.post('/update/password', { user });
  }

  getUsersToAddFriend() {
    return this.apiService.get(`/users/friendsToAdd`);
  }
  myFriends(page = 1, limit = 10, query = {}) {
    return this.apiService.post(`/users/myFriends`, {
      page: page,
      limit: limit,
      query: query,
    });
  }
  getUserRank() {
    return this.apiService.get('/leaderboard/me');
  }

  generateReferralCode() {
    return this.apiService.post('/users/generatereferral');
  }

  applyReferralCode(referralcode: any) {
    return this.apiService.post('/users/applyreferral', { referralcode });
  }
}
