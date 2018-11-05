import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ContractService } from '../services';
import { WalletnodeTxService } from '@setl/core-req-services';
import { ContractModel, PartyModel, AuthorisationModel } from '../models';
import * as moment from 'moment';
import * as _ from 'lodash';

@Injectable()
export class BilateralTransferService {

    constructor(private contractService: ContractService,
                private walletnodeTxService: WalletnodeTxService,
                private ngRedux: NgRedux<any>) {
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

        console.log('+++ witness 1', bilateralFormValues.witness1[0].id);
        console.log('+++ witness 2', bilateralFormValues.witness2[0].id);
        this.addWitnesses(model, bilateralFormValues.witness1[0].id);
        this.addWitnesses(model, bilateralFormValues.witness2[0].id);

        console.log('+++ contract DATA MODEL', model);
        console.log('+++ contract DATA', JSON.parse(this.contractService.toJSON(model)));

        return JSON.parse(this.contractService.toJSON(model));

        /*return {
            authorisations: [
                [
                    data.witness1[0].id,
                    '',
                    '',
                    {},
                    false,
                ],
                [
                    data.witness2[0].id,
                    '',
                    '',
                    {},
                    false,
                ],
            ],
            parameters: [],
            startdate: 0,
            protocol: 'dvp',
            expiry: moment().add(1, 'days').unix(),
            parties: [
                2,
                [
                    'partyA',
                    data.assetAddress[0].id,
                    [
                        [
                            data.assetAddress[0].id,
                            splitAsset[0],
                            splitAsset[1],
                            data.amount,
                            '',
                            '',
                            false,
                            '',
                        ],
                    ],
                    [],
                    '',
                    '',
                    false,
                ],
                [
                    'partyB',
                    data.recipient,
                    [],
                    [
                        [
                            data.recipient,
                            splitAsset[0],
                            splitAsset[1],
                            data.amount,
                        ],
                    ],
                    '',
                    '',
                    false,
                ],
            ],
            encumbrance: { use: false, reference: '' },
            addencumbrances: [],
            issuingaddress: data.assetAddress[0].id,
            events: [
                'commit',
                'expiry',
            ],
            metadata: {},
            __function: 'dvp_uk',
        };*/
    }

    addWitnesses(model, witness) {
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

        // configure the payee
        party.partyIdentifier = identifier;
        party.mustSign = false;

        let receiver: boolean;
        if (identifier === 'partyA') {
            receiver = values.offerType === 'buy';
            party.sigAddress = values.assetAddress[0].id;
        } else {
            receiver = values.offerType === 'sell';
            party.sigAddress = values.recipient;
        }

        if (receiver) {
            // configure receive list
            party.receiveList.push(this.createReceiveListItem(
                party.sigAddress,
                values.asset[0].id,
                values.amount,
            ));
        } else {
            // configure pay list
            party.payList.push(this.createPayListItem(
                party.sigAddress,
                values.asset[0].id,
                values.amount,
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
