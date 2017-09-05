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

/**
 * Convert wallet instruments to an array the select2 can use to render a list a wallet instrument.
 * @param walletInstrumetnList
 * @return {any}
 */
export function walletInstrumentListToSelectItem(walletInstrumentList: object): Array<any> {
    const walletInstrumentListImu = fromJS(walletInstrumentList);
    const walletInstrumentSelectItem = walletInstrumentListImu.reduce(
        (result, thisWalletInstrument, key) => {
            result.push({
                id: key,
                text: key
            });

            return result;
        }, []
    );

    return walletInstrumentSelectItem;
}

/**
 * Convert wallet to relationship to an array the select2 can use to render a list a wallet to relationship.
 * @param walletToRelationshipList
 * @param walletDirectoryList
 * @return {any}
 */
export function walletToRelationshipToSelectItem(walletToRelationship: object, walletDirectoryList: object): Array<any> {
    const walletToRelationshipListImu = fromJS(walletToRelationship);
    const walletToRelationshipSelectItem = walletToRelationshipListImu.reduce(
        (result, thisToRelationship, key) => {
            result.push({
                id: thisToRelationship.get('keyDetail'),
                text: _.get(walletDirectoryList, '[' + key + '].walletName', 'Unknown wallet name')
            });

            return result;
        }, []
    );

    return walletToRelationshipSelectItem;
}

/**
 * Split full asset id, return issuer and instrument in an object.
 * @param fullAssetId
 */
interface SplitFullAssetIdReturn {
    issuer: string;
    instrument: string;
}
export function splitFullAssetId(fullAssetId: string): SplitFullAssetIdReturn {
    const parts = fullAssetId.split('|');

    return {
        issuer: parts[0],
        instrument: parts[1]
    };
}
