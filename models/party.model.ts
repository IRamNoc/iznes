import { PayListItemModel } from '@setl/core-contracts/models/paylistitem.model';
import { ReceiveListItemModel } from '@setl/core-contracts/models/receivelistitem.model';

export class PartyModel {
    public partyIdentifier: string = null;
    public sigAddress: string = null;
    public payList: Array<PayListItemModel> = new Array();
    public receiveList: Array<ReceiveListItemModel> = new Array();
    public publicKey: string = null;
    public signature: string = null;
    public mustSign: boolean = null;
}

