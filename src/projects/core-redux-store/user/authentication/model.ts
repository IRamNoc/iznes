export interface AuthenticationState {
    token: string;
    apiKey: string;
    useTwoFactor: boolean;
    mustChangePassword: boolean;
    isLogin: boolean;
    defaultHomePage: string;
    changedPassword: boolean;
}
