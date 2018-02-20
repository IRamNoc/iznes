import {KycMyInformationsAction, SET_INFORMATIONS} from './actions';

export interface KycMyInformationsState {
    email: string;
    firstName: string;
    lastName: string;
    invitedBy: string;
    companyName: string;
    phoneCode: string;
    phoneNumber: string;
}

const initialState = {
    email: 'tossanmusic@gmail.com',
    firstName: 'toto',
    lastName: 'titi',
    invitedBy: 'tutu',
    companyName: 'turlututu',
    phoneCode: '+33',
    phoneNumber: '123456',
};

export function KycMyInformationsReducer(state: KycMyInformationsState = initialState, action: KycMyInformationsAction): KycMyInformationsState {
    switch (action.type) {
        case SET_INFORMATIONS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
