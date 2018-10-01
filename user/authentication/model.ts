export interface AuthenticationState {
    token: string;
    apiKey: string;
    useTwoFactor: number;
    twoFactorSecret: string;
    mustChangePassword: boolean;
    isLogin: boolean;
    defaultHomePage: string;
    changedPassword: boolean;
}
