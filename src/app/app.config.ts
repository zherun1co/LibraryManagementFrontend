import { provideRouter } from '@angular/router';
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { KeycloakBearerInterceptor, KeycloakService } from 'keycloak-angular';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { routes } from './app.routes';

const initializeKeycloak = (keycloak: KeycloakService) => () =>
  keycloak.init({
    config: {
      url: 'http://localhost:8045',
      realm: 'library-management-realm',
      clientId: 'library-management-frontend-client'
    }, initOptions: {
      onLoad: 'login-required', /* 'login-required' - 'check-sso' */
      redirectUri: window.location.origin,
      silentCheckSsoRedirectUri: window.location.origin
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
    }, KeycloakService, {
      provide: HTTP_INTERCEPTORS,
      useClass: KeycloakBearerInterceptor,
      multi: true
    }
  ]
};