import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['lolSilverToken'];
  }

  saveToken(token: String) {
    window.localStorage['lolSilverToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('lolSilverToken');
  }

}
