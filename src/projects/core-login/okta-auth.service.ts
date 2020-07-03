import { Injectable } from '@angular/core';
import * as OktaAuth from '@okta/okta-auth-js';

@Injectable({
    providedIn: 'root'
})
export class OktaAuthService {
    URL_BASE = location.origin;
    CLIENT_ID: string;
    ISSUER: string;
    LOGIN_REDIRECT_URI = `${this.URL_BASE}/engie-callback`;
    LOGOUT_REDIRECT_URI = this.URL_BASE;
    oktaAuth = new OktaAuth({
        clientId: this.CLIENT_ID,
        issuer: this.ISSUER,
        redirectUri: this.LOGIN_REDIRECT_URI,
        pkce: true
    });

    constructor() {
        if (this.URL_BASE.includes('api.iznes.io')) {
            this.CLIENT_ID = '0oah49n1tfxhVKmvh0x6';
            this.ISSUER = 'https://engieapppreview.oktapreview.com/.well-known/openid-configuration';
        } else if (this.URL_BASE.includes('app.iznes.io')) {
            this.CLIENT_ID = '0oa470nf1sD04JCqg0i7';
            this.ISSUER = 'https://engie.okta-emea.com/.well-known/openid-configuration';
        }
        console.log(this.CLIENT_ID)
    }
    

    // Check if user have okta Token in the token Manager
    async haveToken() {
        const authenticated = await this.oktaAuth.tokenManager.get("accessToken");
        if (authenticated === undefined)
            return false;
        return true;
    }

    // If accessToken is not stored or if token is expired, initiate new login on Okta or return idToken
    async checkTokenValid() {
        const authenticated = await this.oktaAuth.tokenManager.get("accessToken");
        if (authenticated === undefined || await this.checkExpired())
            return this.initiateLogin();
        return await this.oktaAuth.tokenManager.get('idToken')
    }

    // Get Okta user informations by getting accessToken and idToken
    async getUserInfo() {
        const accessToken = await this.oktaAuth.tokenManager.get("accessToken");
        const idToken = await this.oktaAuth.tokenManager.get("idToken");
        return (await this.oktaAuth.token.getUserInfo(accessToken, idToken));
    }

    // Redirecting into Okta server to login in Okta account
    initiateLogin() {
        sessionStorage.setItem('okta-app-url', this.URL_BASE);
        this.oktaAuth.token.getWithRedirect({
            scopes: ['openid', 'email', 'profile']
            , responseMode: "query"
            , responseType: "token"
        });
    }

    // Check if current Okta token is expired or always valid
    async checkExpired() {
        const authenticated = await this.oktaAuth.tokenManager.get("accessToken")
        const expirationDate = new Date((authenticated.expiresAt) * 1000).toISOString();
        let date = new Date().toISOString();
        if (date > expirationDate)
            return true;
        return false;
    }
}
