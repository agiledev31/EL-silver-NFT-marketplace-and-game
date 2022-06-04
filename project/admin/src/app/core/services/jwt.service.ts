import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): String {
    return window.localStorage['lolSilverAdminToken'];
  }

  saveToken(token: String) {
    window.localStorage['lolSilverAdminToken'] = token;
  }

  destroyToken() {
    window.localStorage.removeItem('lolSilverAdminToken');
  }

}
