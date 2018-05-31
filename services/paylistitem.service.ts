import { Injectable } from '@angular/core';
import { PayListItemModel } from '../models';
@Injectable()
export class PayListItemService {
    public fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const payListItem = new PayListItemModel();
        payListItem.address = json[0];
        payListItem.namespace = json[1];
        payListItem.assetId = json[2];
        payListItem.quantity = json[3];
        payListItem.publicKey = json[4];
        payListItem.signatature = json[5];
        payListItem.issuance = json[6];
        payListItem.metadata = json[7];
        return payListItem;
    }

    public toJSON(payListItem) {
        return [
            payListItem.address,
            payListItem.namespace,
            payListItem.assetId,
            payListItem.quantity,
            payListItem.publicKey,
            payListItem.signature,
            payListItem.issuance,
            payListItem.metadata,
        ];
    }
}
