import { inject } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
    const keycloakService = inject(KeycloakService);

    return keycloakService.isLoggedIn();
};