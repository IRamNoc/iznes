import { PayListItemModel } from '@setl/core-contracts/models/paylistitem.model';
import { ReceiveListItemModel } from '@setl/core-contracts/models/receivelistitem.model';

export class PartyModel {
    public partyIdentifier: string = null;
    public sigAddress: string = null;
    public payList: Array<PayListItemModel> = null;
    public receiveList: Array<ReceiveListItemModel> = null;
    public publicKey: string = null;
    public signature: string = null;
    public mustSign: boolean = null;
}
