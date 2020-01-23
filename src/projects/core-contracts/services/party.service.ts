import { Injectable } from '@angular/core';
import { PartyModel } from '../models';
import { PayListItemService } from '../services/paylistitem.service';
import { PayListItemModel } from '../models';
import { ReceiveListItemService } from '../services/receivelistitem.service';
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
        const payList = [];
        _.each(party.payList, (payListItem) => {
            if (payListItem instanceof Array) {
                payList.push(payListItem);
            } else {
                payList.push(this.payListItemService.toJSON(payListItem));
            }
        });

        const receiveList = [];
        _.each(party.receiveList, (receiveListItem) => {
            if (receiveListItem instanceof Array) {
                receiveList.push(receiveListItem);
            } else {
                receiveList.push(this.receiveListItemService.toJSON(receiveListItem));
            }
        });

        const result =  [
            party.partyIdentifier,
            party.sigAddress,
            payList,
            receiveList,
            party.publicKey,
            party.signature,
            party.mustSign,
        ];

        return result;
    }

    public create(
        partyIdentifier = null,
        sigAddress = null,
        payList = null,
        receiveList = null,
        publicKey = null,
        signature = null,
        mustSign = null,
    ) {
        const party = new PartyModel();
        party.partyIdentifier = partyIdentifier;
        party.sigAddress = sigAddress;

        _.each(payList, (payListItem) => {
            this.addPayListItem(party, this.payListItemService.fromJSON(payListItem));
        });
        _.each(receiveList, (receiveListItem) => {
            this.addReceiveListItem(party, this.receiveListItemService.fromJSON(receiveListItem));
        });

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
