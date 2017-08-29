import {Action} from 'redux';
import * as ManageWalletActions from './actions';
import {ManagedWalletsState, WalletDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: ManagedWalletsState = {
    walletList: {}
};

export const ManagedWalletsReducer = function (state: ManagedWalletsState = initialState,
                                               action: Action) {
    let newState: ManagedWalletsState;
    let walletsData: Array<any>;
    let walletList: {
        [key: number]: WalletDetail
    };

    switch (action.type) {
        case ManageWalletActions.SET_MANAGED_WALLETS:
            walletsData = _.get(action, 'payload[1].Data', []);

            walletList = formatToWalletList(walletsData);

            newState = Object.assign({}, state, {
                walletList
            });

            return newState;

        default:
            return state;
    }
};

function formatToWalletList(rawWalletList: Array<any>): {
    [key: number]: WalletDetail
} {
    const rawWalletDataList = fromJS(rawWalletList);

    const walletsObject = Map(rawWalletDataList.reduce(
        function (result, item) {
            const walletLocked = item.get('walletLocked') === '1';

            result[item.get('walletID')] = {

                walletId: item.get('walletID'),
                walletName: item.get('walletName'),
                walletType: item.get('walletType'),
                walletLocked: walletLocked,
                Glei: item.get('GLEI'),
                accountId: item.get('accountID'),
                accountName: item.get('accountName'),
                address1: item.get('address1'),
                address2: item.get('address2'),
                address3: item.get('address3'),
                address4: item.get('address4'),
                addressPrefix: item.get('addressPrefix'),
                aliases: item.get('aliases'),
                bankBicCode: item.get('bankBICCode'),
                bankName: item.get('bankName'),
                bankWalletId: item.get('bankWalletID'),
                bankAccountName: item.get('bankAccountName'),
                bankAccountNum: item.get('bankAccountNum'),
                bdAddress1: item.get('bdAddress1'),
                bdAddress2: item.get('bdAddress2'),
                bdAddress3: item.get('bdAddress3'),
                bdAddress4: item.get('bdAddress4'),
                bdAddressPrefix: item.get('bdAddressPrefix'),
                bdCountry: item.get('bdCountry'),
                bdPostalCode: item.get('bdPostalCode'),
                caAddress1: item.get('caAddress1'),
                caAddress2: item.get('caAddress2'),
                caAddress3: item.get('caAddress3'),
                caAddress4: item.get('caAddress4'),
                caAddressPrefix: item.get('caAddressPrefix'),
                caCountry: item.get('caCountry'),
                caPostalCode: item.get('caPostalCode'),
                commuPub: item.get('commuPub'),
                country: item.get('country'),
                formerName: item.get('formerName'),
                idCardNum: item.get('idCardNum'),
                incorporationData: item.get('incorporationData'),
                parent: item.get('parent'),
                platformRegData: item.get('platformRegData'),
                postalCode: item.get('postalCode'),
                rdaAddress1: item.get('rdaAddress1'),
                rdaAddress2: item.get('rdaAddress2'),
                rdaAddress3: item.get('rdaAddress3'),
                rdaAddress4: item.get('rdaAddress4'),
                rdaAddressPrefix: item.get('rdaAddressPrefix'),
                rdaCountry: item.get('rdaCountry'),
                rdaPostalCode: item.get('rdaPostalCode'),
                uid: item.get('uid'),
                websiteUrl: item.get('websiteUrl'),
            };
            return result;
        },
        {}));

    return walletsObject.toJS();
}

