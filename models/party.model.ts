import { PayListItemModel } from './paylistitem.model';
import { ReceiveListItemModel } from './receivelistitem.model';

export class PartyModel {
    public partyIdentifier: string = '';
    public sigAddress: string = '';
    public payList: Array<PayListItemModel> = new Array();
    public receiveList: Array<ReceiveListItemModel> = new Array();
    public publicKey: string = '';
    public signature: string = '';
    public mustSign: boolean = false;
}

