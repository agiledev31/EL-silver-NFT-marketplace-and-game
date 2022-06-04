import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { User } from '../core';

@Injectable({
  providedIn: 'root'
})
export class VerifyService {
  private valueSubject = new BehaviorSubject<any>(null);
  public currentValue = this.valueSubject.asObservable().pipe(distinctUntilChanged());

  constructor() {
    let v = window.localStorage['lolSilverVerify'];
    v && this.valueSubject.next(JSON.parse(v));
   }

  set(value: any) {
    window.localStorage['lolSilverVerify'] =  JSON.stringify(value);
    this.valueSubject.next(value);
  }

  purge () {
    this.valueSubject.next(null);
    window.localStorage.removeItem('lolSilverVerify');
  }
}
