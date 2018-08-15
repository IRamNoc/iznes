export interface ISignupConfiguration {
    buttonText: string;
    description: string;
    redirectURL: string;
    title: string;

    signupCallback: (form: ISignupForm) => Promise<any>;
}

export interface ISignupForm {
    username: string;
    password: string;
    passwordConfirm: string;
}
