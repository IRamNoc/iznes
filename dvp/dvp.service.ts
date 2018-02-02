import {Injectable} from '@angular/core';
import {NgRedux} from '@angular-redux/store';

import {ContractService} from '@setl/core-contracts/services';
import {WalletnodeTxService} from '@setl/core-req-services';
import {SagaHelper, mDateHelper} from '@setl/utils';

import {ContractModel, ParameterItemModel, PartyModel, PayListItemModel, ReceiveListItemModel} from '@setl/core-contracts/models';
import {DvpParty, DvpForm, DvpFormParty, partyA, partyB} from './dvp.model';
import * as moment from 'moment';
import { error } from 'selenium-webdriver';

@Injectable()
export class DVPContractService {

    constructor(private contractService: ContractService,
        private walletnodeTxService: WalletnodeTxService,
        private ngRedux: NgRedux<any>) {}

    create(parties: [DvpParty, DvpParty],
        values: DvpForm,
        walletId: number,
        successCallback: (res) => void,
        errorCallback: (res) => void): void {

        const model: ContractModel = new ContractModel();

        model.events = ['commit', 'expiry'];
        model.expiry = moment(`${values.expireDate}T${values.expireTime}:00`).unix();
        model.function = 'dvp_uk';
        model.issuingaddress = values.creator[0].id;
        model.protocol = 'dvp';
        model.startdate = moment().add(1, 'hour').unix();

        const isExchangeContract = parties[1].toggleAssetReturn &&
            values[parties[1].id].return_asset;

        this.addPartiesToContract(model, values, isExchangeContract);
        this.addParametersToContract(model, values);

        const contractData = JSON.parse(this.contractService.toJSON(model));

        this.submitContract(walletId, values.creator[0].id, contractData.contractdata, successCallback, errorCallback);
    }

    private submitContract(walletId: number,
        address: string,
        contractData: any,
        successCallback: (res) => void,
        errorCallback: (res) => void): void {
            
        const asyncTaskPipe = this.walletnodeTxService.newContract({
            walletId: walletId,
            address: address,
            function: 'dvp_uk',
            contractData: contractData
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (data) => {
                console.log('created contract:', data);
                successCallback(data[1].data);
            },
            (data) => {
                console.log('failed to create contract', data);
                errorCallback(data);
            }
        ));
    }

    private addPartiesToContract(model: ContractModel, values: DvpForm, isExchange: boolean): void {
        if(!model.parties) model.parties = [];

        model.parties.push(this.createPartyA(values, isExchange));
        model.parties.push(this.createPartyB(values, isExchange));
    }

    private createPartyA(values: DvpForm, isExchange: boolean): PartyModel {
        // PARTY A
        const party = new PartyModel();

        // configure Party A as the payee
        party.partyIdentifier = partyA;
        party.sigAddress = values[partyA].address;
        party.mustSign = false;

        // configure pay list
        party.payList.push(this.createPayListItem(
            values[partyA].address,
            values[partyA].asset[0].id,
            values[partyA].amount
        ));

        if(isExchange) {
            // configure receive list
            party.receiveList.push(this.createReceiveListItem(
                values[partyA].address,
                values[partyB].asset[0].id,
                values[partyB].amount
            ));
        }

        return party;
    }

    private createPartyB(values: DvpForm, isExchange: boolean): PartyModel {
        // PARTY B
        const party = new PartyModel();   

        // configure Party A as the payee
        party.partyIdentifier = partyB;
        party.sigAddress = values[partyB].address;
        party.mustSign = false;  

        // configure receive list
        party.receiveList.push(this.createReceiveListItem(
            values[partyB].address,
            values[partyA].asset[0].id,
            values[partyA].amount
        ));

        if(isExchange) {
            // configure pay list
            party.payList.push(this.createPayListItem(
                values[partyB].address,
                values[partyB].asset[0].id,
                values[partyB].amount
            ));
        }

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
            ''
        ];
    }

    private createReceiveListItem(address: string, asset: string, amount: number): any {
        const splitAsset = asset.split('|');

        return [
            address,
            splitAsset[0],
            splitAsset[1],
            amount
        ];
    }

    private addParametersToContract(model: ContractModel, values: DvpForm): void {
        const parameter = new ParameterItemModel();

        parameter.key = 'nav';
        parameter.address = values[partyA].address;
        parameter.value = '';
        parameter.calculatedIndex = '0';
        parameter.contractSpecific = 0;
        parameter.calculationOnly = 0;
        parameter.signature = '';

        model.parameters.push(parameter);
    }

}
