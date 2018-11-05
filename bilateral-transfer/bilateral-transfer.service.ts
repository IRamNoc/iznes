import { Injectable } from '@angular/core';
import { ContractService } from '../services';
import { ContractModel, PartyModel, AuthorisationModel } from '../models';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class BilateralTransferService {

    constructor(private contractService: ContractService) {
    }

    getContractData(bilateralFormValues) {
        const addressAddress = _.get(bilateralFormValues, 'assetAddress[0].id', '');

        const model: ContractModel = new ContractModel();

        model.events = ['commit', 'expiry'];
        model.expiry = moment().add(1, 'days').unix();
        model.function = 'dvp_uk';
        model.issuingaddress = addressAddress;
        model.protocol = 'dvp';

        this.addPartiesToContract(model, bilateralFormValues);

        this.addWitnesses(model, bilateralFormValues.witness1[0].id);
        this.addWitnesses(model, bilateralFormValues.witness2[0].id);

        return JSON.parse(this.contractService.toJSON(model));
    }

    private addWitnesses(model, witness) {
        if (witness) {
            const witnessModel = new AuthorisationModel();
            witnessModel.publicKey = witness;
            witnessModel.authorisationId = '';
            witnessModel.signature = '';
            witnessModel.metadata = {};
            witnessModel.refused = false;
            model.authorisations.push(witnessModel);
        }
    }

    private addPartiesToContract(model: ContractModel, values): void {
        if (!model.parties) model.parties = [];

        model.parties.push(this.createParty('partyA', values));
        model.parties.push(this.createParty('partyB', values));
    }

    private createParty(identifier, values): PartyModel {
        const party = new PartyModel();
        party.partyIdentifier = identifier;
        party.mustSign = false;
        let isReceiver: boolean;

        if (identifier === 'partyA') {
            isReceiver = values.offerType === 'buy';
            party.sigAddress = values.assetAddress[0].id;
        } else {
            isReceiver = values.offerType === 'sell';
            party.sigAddress = values.recipient;
        }

        isReceiver ?
            party.receiveList.push(this.createReceiveListItem(party.sigAddress, values.asset[0].id, values.amount)) :
            party.payList.push(this.createPayListItem(party.sigAddress, values.asset[0].id, values.amount));

        return party;
    }

    private createPayListItem(address: string, asset: string, amount: number): any {
        const splitAsset = asset.split('|');

        return [
            address,
            splitAsset[0],
            splitAsset[1],
            amount,
            '',
            '',
            false,
            '',
        ];
    }

    private createReceiveListItem(address: string, asset: string, amount: number): any {
        const splitAsset = asset.split('|');

        return [
            address,
            splitAsset[0],
            splitAsset[1],
            amount,
        ];
    }
}
