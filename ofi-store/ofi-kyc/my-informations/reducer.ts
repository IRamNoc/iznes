import {KycMyInformationsAction, SET_INFORMATIONS, SET_INFORMATIONS_FROM_API} from './actions';
import * as _ from 'lodash';
import {KycUser} from './model';

export interface KycMyInformationsState extends KycUser {
    invitedBy: KycUser;
}

const initialState = {
    email: '',
    firstName: '',
    lastName: '',
    invitedBy: {
        email: '',
        firstName: '',
        lastName: '',
        companyName: '',
        phoneCode: '',
        phoneNumber: '',
    },
    companyName: '',
    phoneCode: '',
    phoneNumber: '',
};

export function KycMyInformationsReducer(
    state: KycMyInformationsState = initialState,
    action: KycMyInformationsAction
): KycMyInformationsState {
    switch (action.type) {
        case SET_INFORMATIONS_FROM_API:
            const res = _.get(action.payload, ['1', 'Data', '0'], {});
            const newData = {
                email: res.investorEmail || '',
                firstName: res.investorFirstName || '',
                lastName: res.investorLastName || '',
                invitedBy: {
                    email: res.amEmail || '',
                    firstName: res.amFirstName || '',
                    lastName: res.amLastName || '',
                    companyName: res.amCompanyName || '',
                    phoneCode: res.amPhoneCode || '',
                    phoneNumber: res.amPhoneNumber || '',
                },
                companyName: res.companyName || '',
                phoneCode: res.investorPhoneCode || '',
                phoneNumber: res.investorPhoneNumber || '',
            };
            return {
                ...state,
                ...newData,
            };
        case SET_INFORMATIONS:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
