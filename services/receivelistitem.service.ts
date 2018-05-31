import { Injectable } from '@angular/core';
import { ReceiveListItemModel } from '../models';

@Injectable()
export class ReceiveListItemService {
    public fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const receiveListItem = new ReceiveListItemModel();
        receiveListItem.address = json[0];
        receiveListItem.namespace = json[1];
        receiveListItem.assetId = json[2];
        receiveListItem.quantity = json[3];
        return receiveListItem;
    }

    public toJSON(receiveListItem) {
        return [
            receiveListItem.address,
            receiveListItem.namespace,
            receiveListItem.assetId,
            receiveListItem.quantity,
            receiveListItem.publicKey,
            receiveListItem.signature,
            receiveListItem.issuance,
            receiveListItem.metadata,
        ];
    }
}
