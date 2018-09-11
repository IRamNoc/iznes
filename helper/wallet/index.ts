import { fromJS } from 'immutable';
import * as _ from 'lodash';

/**
 * Converts wallet Address to an array the select2 can use to render a list a wallet address.
 *
 * @param walletAddressList
 *
 * @return {any}
 */
export function walletAddressListToSelectItem(walletAddressList: any, labelIdentifier: string = null): any {
    const walletAddressListImu = fromJS(walletAddressList);
    const walletAddressSelectItem = walletAddressListImu.reduce(
        (result, thisWalletAddress, key) => {
            let label = thisWalletAddress.get(labelIdentifier);

            if (labelIdentifier === 'label' && thisWalletAddress.get('addr')) {
                // if using label add the wallet address to the end
                label = `${label} (${key.substr(0, 8)}...)`;
            }

            result.push({
                id: key,
                text: (labelIdentifier && label) ? label : key,
            });

            return result;
        },
        [],
    );

    return walletAddressSelectItem;
}

/**
 * Converts wallet instruments to an array the select2 can use to render a list a wallet instrument.
 *
 * @param walletInstrumetnList
 *
 * @return {any}
 */
export function walletInstrumentListToSelectItem(walletInstrumentList: object): any[] {
    const walletInstrumentListImu = fromJS(walletInstrumentList);
    const walletInstrumentSelectItem = walletInstrumentListImu.reduce(
        (result, thisWalletInstrument, key) => {
            result.push({
                id: key,
                text: key,
            });

            return result;
        },
        [],
    );

    return walletInstrumentSelectItem;
}

/**
 * Converts wallet to relationship to an array the select2 can use to render a list a wallet to relationship.
 *
 * @param walletToRelationshipList
 * @param walletDirectoryList
 *
 * @return {any}
 */
export function walletToRelationshipToSelectItem(
    walletToRelationship: object, walletDirectoryList: object): any[] {
    const walletToRelationshipListImu = fromJS(walletToRelationship);
    const walletToRelationshipSelectItem = walletToRelationshipListImu.reduce(
        (result, thisToRelationship, key) => {
            let walletName = 'Unknown wallet name';

            Object.keys(walletDirectoryList).forEach((item) => {
                if (walletDirectoryList[item].id === String(key)) {
                    walletName = walletDirectoryList[item].text;
                }
            });

            result.push({
                id: thisToRelationship.get('keyDetail'),
                text: walletName,
            });

            return result;
        },
        [],
    );

    return walletToRelationshipSelectItem;
}

/**
 * Splits full asset ID and returns issuer and instrument in an object.
 *
 * @param {string} fullAssetId
 *
 * @return {object}
 */
interface SplitFullAssetIdReturn {
    issuer: string;
    instrument: string;
}
export function splitFullAssetId(fullAssetId: string): SplitFullAssetIdReturn {
    const parts = fullAssetId.split('|');

    return {
        issuer: parts[0],
        instrument: parts[1],
    };
}
