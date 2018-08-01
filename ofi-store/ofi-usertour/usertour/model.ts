import {List} from 'immutable';

export interface UserToursDetails {
    walletID: boolean;
}

export interface UserTourState {
    userTours: List<UserToursDetails>;
    userToursRequested: boolean;
}
