import * as actions from './actions';
import {Action} from 'redux';
import * as _ from 'lodash';
import {AmKycListState} from './model';
import {immutableHelper, mDateHelper} from '@setl/utils';

const initialState: AmKycListState = {
    amKycList: [],
    requested: false
};

export function AmKycListReducer(state: AmKycListState = initialState,
                                 action: Action): AmKycListState {
    switch (action.type) {
        case actions.SET_AMKYCLIST:
            return handleSetAmKycList(state, action);
        case actions.SET_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_REQUESTED:
            return toggleRequested(state, false);
        default:
            return state;
    }
}

/**
 * Handle set am kyc list
 *
 * @param state
 * @param action
 * @return {AmKycListState}
 */
function handleSetAmKycList(state: AmKycListState, action: Action): AmKycListState {
    const amKycListData = _.get(action, 'payload[1].Data', []);
    let amKycList: AmKycListState[] = [];
    try {
        amKycList = immutableHelper.reduce(amKycListData, (result, item) => {
            result.push({
                kycID: item.get('kycID', 0),
                investorUserID: item.get('investorUserID', 0),
                investorUserName: item.get('investorUserName', 0),
                investorFirstName: item.get('investorFirstName', 0),
                investorLastName: item.get('investorLastName', 0),
                investorEmail: item.get('investorEmail', 0),
                investorPhoneCode: item.get('phoneCode', 0),
                investorPhoneNumber: item.get('phoneNumber', 0),
                investorCompanyName: item.get('investorCompanyName', 0),
                amUserName: item.get('amUserName', 0),
                amFirstName: item.get('amFirstName', 0),
                amLastName: item.get('amLastName', 0),
                lastUpdated: mDateHelper.convertUtcStrToLocalStr(item.get('lastUpdated', 0), 'YYYY-MM-DD HH:mm'),
                lastReviewBy: item.get('lastReviewBy', 0),
                investorWalletID: item.get('investorWalletID', 0),
                walletName: item.get('walletName', 0),
                companyName: item.get('companyName', 0),
                isInvited: item.get('isInvited', 0),
                invitedID: item.get('invitedID', 0),
                status: item.get('kycStatus', 0),
                investorType: item.get('investorType', 0),
                fundName: item.get('fundName', 0),
                dateEntered: mDateHelper.convertUtcStrToLocalStr(item.get('dateEntered', 0), 'YYYY-MM-DD HH:mm'),
                clientReference: item.get('clientReference', 0),
                alreadyCompleted: item.get('alreadyCompleted', 0)
            });

            return result;
        }, []);
    } catch (e) {
        amKycList = [];
    }

    return Object.assign({}, state, {
        amKycList
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&AmKycListState&{requested: boolean}}
 */
function toggleRequested(state: AmKycListState, requested): AmKycListState {

    return Object.assign({}, state, {
        requested
    });
}
