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
    email: '',
    firstName: '',
    lastName: '',
    invitedBy: '',
    companyName: '',
    phoneCode: '',
    phoneNumber: '',
};

export function KycMyInformationsReducer(
    state: KycMyInformationsState = initialState,
    action: KycMyInformationsAction
): KycMyInformationsState {
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
