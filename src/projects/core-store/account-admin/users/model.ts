export interface User {
    userID: number;
    reference: string;
    firstName: string;
    lastName: string;
    emailAddress: string;
    phoneNumber: string;
    userTypeID: number;
    userType: string;
    userStatus: number;
}

export interface UsersState {
    users: User[];
    requested: boolean;
}
