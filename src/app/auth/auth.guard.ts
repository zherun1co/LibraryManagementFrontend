import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = async (route, state) => {
    const keycloakService = inject(KeycloakService);

    if (keycloakService.isLoggedIn())
        return true;   
    else {
        keycloakService.login({ redirectUri: window.location.origin + state.url });
        return false;
    }
};