export interface AuthenticationState {
    token: string;
    apiKey: string;
    useTwoFactor: boolean;
    twoFactorSecret: string;
    sessionTimeoutSecs: number;
    mustChangePassword: boolean;
    isLogin: boolean;
    defaultHomePage: string;
    changedPassword: boolean;
}
