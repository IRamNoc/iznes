import {KycMyInformationsAction, SET_INFORMATIONS, SET_INFORMATIONS_FROM_API} from './actions';
import * as _ from 'lodash';
<<<<<<< HEAD
import {KycUser} from './model';
import { kycPartySelections } from '../../../ofi-kyc/my-requests/kyc-form-helper';
=======
import { KycUser, KycPartySelections } from './model';
>>>>>>> e877f3e727145fc00ff5d841db9371cb0956a801

export interface KycMyInformationsState extends KycUser {
    invitedBy: KycUser;
    amCompanyName: string;
    amManagementCompanyID: number;
    invitationToken: string;
    investorType: number;
<<<<<<< HEAD
    kycPartySelections: kycPartySelections;
=======
    kycPartySelections: KycPartySelections;
>>>>>>> e877f3e727145fc00ff5d841db9371cb0956a801
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
    amCompanyName: '',
    phoneCode: '',
    phoneNumber: '',
    amManagementCompanyID: null,
    invitationToken: '',
    investorType: 0,
    kycPartySelections: null,
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
                companyName: res.investorCompanyName || '',
                amCompanyName: res.companyName || '',
                phoneCode: res.investorPhoneCode || '',
                phoneNumber: res.investorPhoneNumber || '',
                amManagementCompanyID: res.amManagementCompanyID,
                invitationToken: res.invitationToken,
                investorType: res.investorType,
                kycPartySelections: getPartySelection(res.kycPartySelections),
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

function getPartySelection(kycPartySelections) {
    let partySelections = kycPartySelections;

    if (partySelections) {
        try {
            partySelections = JSON.parse(kycPartySelections);
        } catch (e) {
            console.error('Unable to parse KYC Party Selections', e);
            partySelections = null;
        }
    }

    return partySelections;
}
