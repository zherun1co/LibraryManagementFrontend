import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { KeycloakAngularModule, KeycloakService, KeycloakEventType } from 'keycloak-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
      CommonModule
     ,RouterModule
     ,MatListModule
     ,MatIconModule
     ,HttpClientModule
     ,MatSidenavModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  keycloakService: KeycloakService;
  clipboard: Clipboard;
  statusPanel: string = '';
  httpClient: HttpClient;

  isExpanded: boolean = true;
  
  constructor( keycloakService: KeycloakService
              ,clipboard: Clipboard
              ,httpClient: HttpClient) {
    this.keycloakService = keycloakService;
    this.clipboard = clipboard;
    this.httpClient = httpClient;

    keycloakService.keycloakEvents$.subscribe({
      next: (event) => {
        if (event.type == KeycloakEventType.OnTokenExpired) {
          keycloakService.updateToken(20);
        }
      }
    });
  }

  toggleSidebar(): void {
    this.isExpanded = !this.isExpanded;
  }

  public login(): void {
    this.keycloakService.login();
  }

  public logout(): void {
    this.keycloakService.logout();
  }

  public async isLoggedIn(): Promise<void> {
    this.statusPanel = 'Is Logged In: ' + (this.keycloakService.isLoggedIn());
  }

  public copyAccessTokenToClipboard(): void {
    this.keycloakService.getToken().then(token => {
      this.clipboard.copy(token);
      this.statusPanel = 'Copied the token to clipboard';
    }).catch(e => this.statusPanel = 'Error occurred while copying');
  }

  public parseAccessToken(): void {
    this.keycloakService.getToken().then(token => {
      this.statusPanel = this.toJWTString(token);
    }).catch(e => { 
      this.statusPanel = 'Error occurred while parsing. Check console logs'; 
      console.error(e); 
    });
  }

  public isTokenExpired(): void {
    this.statusPanel = this.keycloakService.isTokenExpired(10).toString();
  }

  public async updateToken() {
    try {
      let refreshed = await this.keycloakService.updateToken(5);
      this.statusPanel = (refreshed ? 'Token was refreshed' : 'Token is still valid');
    } catch (error) {
      this.statusPanel = 'Failed to refresh the token. Check console logs';
      console.error('Failed to refresh the token:', error);
    }
  }

  public showRoles() {
    let roles = this.keycloakService.getUserRoles();
    this.statusPanel = roles.join(', ');
  }

  public resetPanel() {
    this.statusPanel = '';
  }

  private toJWTString(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return jsonPayload;
  }
}