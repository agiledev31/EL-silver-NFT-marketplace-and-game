import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import {
  ApiService,
  AuthGuard,
  JwtService,
  MatchMakingService,
  MatchService,
  UserService
} from './services';
import { NoAuthGuard } from './services/no-auth-guard.service';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
  CommonModule,
    HttpClientModule,
    SocialLoginModule
  ],
  providers: [

      {
        provide: 'SocialAuthServiceConfig',
        useValue: {
          autoLogin: false,
          providers: [
            {
              id: GoogleLoginProvider.PROVIDER_ID,
              provider: new GoogleLoginProvider(
                environment.googleClientId
              )
            }
          ]
        } as SocialAuthServiceConfig,
      },

    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiService,
    AuthGuard,
    JwtService,
    UserService,
    MatchService,
    MatchMakingService,
    NoAuthGuard
  ],
  declarations: []
})
export class CoreModule { }
