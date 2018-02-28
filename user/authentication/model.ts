export interface AuthenticationState {
    token: string;
    apiKey: string;
    useTwoFactor: number;
    mustChangePassword: boolean;
    isLogin: boolean;
    defaultHomePage: string;
}
