import { Injectable } from '@angular/core';
import * as OktaAuth from '@okta/okta-auth-js';

@Injectable({
	providedIn: 'root'
})
export class OktaAuthService {
	CLIENT_ID = '0oaakvvb46DXdpxBB4x6';
	ISSUER = 'https://dev-698165.okta.com/oauth2/default'
	LOGIN_REDIRECT_URI = 'https://192.168.1.85:4200/implicit-callback';
	LOGOUT_REDIRECT_URI = 'https://192.168.1.85:4200/implicit-callback';
	oktaAuth = new OktaAuth({
		clientId: this.CLIENT_ID,
		issuer: this.ISSUER,
		redirectUri: this.LOGIN_REDIRECT_URI,
		responseMode: 'fragment',
		pkce: true
	});
	
	constructor() {
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

    // Redirecting into Okta server to login in Okta account
    async initiateLogin() {
        sessionStorage.setItem('okta-app-url', 'https://192.168.1.85:4200');
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
