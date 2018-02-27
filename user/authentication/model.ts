export interface AuthenticationState {
    token: string;
    apiKey: string;
    useTwoFactor: number;
    isLogin: boolean;
    defaultHomePage: string;
}
