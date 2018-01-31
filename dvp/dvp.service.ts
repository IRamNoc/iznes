import { Injectable } from '@angular/core';

import {ContractService} from '@setl/core-contracts/services';
import {ContractModel, PartyModel, PayListItemModel, ReceiveListItemModel} from '@setl/core-contracts/models';
import {DvpParty, DvpForm, DvpFormParty, partyA, partyB} from './dvp.model';

@Injectable()
export class DVPContractService {

    constructor(private contractService: ContractService) {}

    create(parties: [DvpParty, DvpParty], values: DvpForm): void {
        const model: ContractModel = new ContractModel();

        model.issuingaddress = values.creator[0].id;
        model.expiry = `${values.expireDate} ${values.expireTime}`;

        const isExchangeContract = parties[1].toggleAssetReturn &&
            values[parties[1].id].return_asset;

        this.addPartiesToContract(model, values, isExchangeContract);

        console.log(this.contractService.toJSON(model));
    }

    private addPartiesToContract(model: ContractModel, values: DvpForm, isExchange: boolean): void {
        if(!model.parties) model.parties = [];

        // PARTY A
        const partyAModel = new PartyModel();
        // configure Party A as the payee
        partyAModel.partyIdentifier = partyA;
        partyAModel.signature = values[partyA].address;
        partyAModel.mustSign = false;
        // configure pay list
        partyAModel.payList.push(this.createPayListItem(
            values[partyA].address,
            values[partyA].asset[0].id,
            values[partyA].amount
        ));        
        
        // PARTY B
        const partyBModel = new PartyModel();        
        // configure Party A as the payee
        partyBModel.partyIdentifier = partyB;
        partyBModel.signature = values[partyB].address;
        partyBModel.mustSign = false;        
        // configure receive list
        partyBModel.receiveList.push(this.createReceiveListItem(
            values[partyB].address,
            values[partyA].asset[0].id,
            values[partyA].amount
        ));
        
        // add party
        model.parties.push(partyAModel);
        model.parties.push(partyBModel);
    }

    private createPayListItem(address: string, asset: string, amount: number): PayListItemModel {
        const payListItem = new PayListItemModel();
        const splitAsset = asset.split('|');
        payListItem.address = address;
        payListItem.namespace = splitAsset[0];
        payListItem.assetId = splitAsset[1];
        payListItem.quantity = amount;
        payListItem.issuance = true;

        return payListItem;
    }

    private createReceiveListItem(address: string, asset: string, amount: number): ReceiveListItemModel {
        const payListItem = new ReceiveListItemModel();
        const splitAsset = asset.split('|');
        payListItem.address = address;
        payListItem.namespace = splitAsset[0];
        payListItem.assetId = splitAsset[1];
        payListItem.quantity = amount;

        return payListItem;
    }

}
