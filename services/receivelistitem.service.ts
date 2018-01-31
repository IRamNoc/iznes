import { Injectable } from '@angular/core';
import { ReceiveListItemModel } from '@setl/core-contracts/models/receivelistitem.model';

@Injectable()
export class ReceiveListItemService {
    public fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let receiveListItem = new ReceiveListItemModel();
        receiveListItem.address = json[0];
        receiveListItem.namespace = json[1];
        receiveListItem.assetId = json[2];
        receiveListItem.quantity = json[3];
        return receiveListItem;
    }
}
