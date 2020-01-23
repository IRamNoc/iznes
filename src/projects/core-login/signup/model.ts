export interface ISignupConfiguration {
    doLoginAfterCallback: boolean;
    buttonText?: string;
    description?: string;
    doLoginRedirect?: boolean;
    redirectURL?: string;
    username?: string;
    title?: string;

    signupCallback?: (form: ISignupForm) => Promise<void>;
}

export interface ISignupForm {
    username: string;
    password: string;
    passwordConfirm: string;
}

export interface ISignupData {
    username: string;
    password: string;
    invitationToken: string;
    language: string;
}
