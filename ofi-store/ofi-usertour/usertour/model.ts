import {List} from 'immutable';

export interface UserToursDetails {
    type: any;
    value: number;
    walletID: number;
}

export interface UserTourState {
    userTours: List<UserToursDetails>;
    userToursRequested: boolean;
}
