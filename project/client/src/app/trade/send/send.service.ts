import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SendService {
  public friendsSubject = new BehaviorSubject<any>(null);
  public friends = this.friendsSubject.asObservable().pipe(distinctUntilChanged());
  constructor() { }
}
