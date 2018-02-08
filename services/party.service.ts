import { Injectable } from '@angular/core';
import { PartyModel } from '../models';
import { PayListItemService} from '../services';
import { PayListItemModel } from '../models';
import { ReceiveListItemService } from '../services';
import { ReceiveListItemModel } from '../models';
import * as _ from 'lodash';


@Injectable()
export class PartyService {
    private payListItemService: PayListItemService;
    private receiveListItemService: ReceiveListItemService;
    public constructor() {
        this.payListItemService = new PayListItemService();
        this.receiveListItemService = new ReceiveListItemService;
    }

    public fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let party = new PartyModel();
        party = this.create(json[0], json[1], json[2], json[3], json[4], json[5], json[6]);
        return party;
    }

    public toJSON(party: PartyModel) {
        return [
            party.partyIdentifier,
            party.sigAddress,
            party.payList,
            party.receiveList,
            party.publicKey,
            party.signature,
            party.mustSign
        ];
    }

    public create(
        partyIdentifier = null,
        sigAddress = null,
        payList = null,
        receiveList = null,
        publicKey = null,
        signature = null,
        mustSign = null
    ) {
        let party = new PartyModel();
        party.partyIdentifier = partyIdentifier;
        party.sigAddress = sigAddress;

        this.addPayListItem(party, payList);
        this.addReceiveListItem(party, receiveList);

        party.publicKey = publicKey;
        party.signature = signature;
        party.mustSign = mustSign;
        return party;
    }

    public addPayListItem(party: PartyModel, payListItem: PayListItemModel) {
        party.payList.push(payListItem);
    }

    public addReceiveListItem(party: PartyModel, receiveListItem: ReceiveListItemModel) {
        party.receiveList.push(receiveListItem);
    }
}
