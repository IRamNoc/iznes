export interface User {
    reference: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    userType: string;
}

export interface UsersState {
    users: User[];
    requested: boolean;
}
