import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';

import { routes } from './app.routes';

const initializeKeycloak = (keycloak: KeycloakService) => () =>
  keycloak.init({
    config: {
      url: 'http://localhost:8045',
      realm: 'library-management-realm',
      clientId: 'library-management-frontend-client'
    },
    initOptions: {
      onLoad: 'check-sso', // 'login-required' , 'check-sso'
      silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html'
    },
    enableBearerInterceptor: true
  });

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()), {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService]
    },
    KeycloakService, {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};