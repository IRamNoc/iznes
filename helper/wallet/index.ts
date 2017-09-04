import {fromJS} from 'immutable';

/**
 * Convert wallet Address to an array the select2 can use to render a list a wallet address.
 * @param walletAddressList
 * @return {any}
 */
export function walletAddressListToSelectItem(walletAddressList: Array<any>): Array<any> {
    const walletAddressListImu = fromJS(walletAddressList);
    const walletAddressSelectItem = walletAddressListImu.map(
        (thisWalletAddress) => {
            return {
                id: thisWalletAddress.get('addr'),
                text: thisWalletAddress.get('addr')
            };
        }
    );

    return walletAddressSelectItem.toJS();
}

