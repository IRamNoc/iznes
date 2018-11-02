import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { ContractService } from '../services';
import { WalletnodeTxService } from '@setl/core-req-services';
import { ContractModel, PartyModel, PayListItemModel, ReceiveListItemModel } from '../models';
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

        this.addPartiesToContract(model, bilateralFormValues, bilateralFormValues.offerType === 'buy');

        this.addWitnesses(model, bilateralFormValues.witness1[0].id);
        this.addWitnesses(model, bilateralFormValues.witness2[0].id);

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
            model.authorisations.push({
                publicKey: witness,
                authorisationId: '',
                signature: '',
                metadata: {},
                refused: false,
            });
        }
    }

    private addPartiesToContract(model: ContractModel, values, isBuying: boolean): void {
        if (!model.parties) model.parties = [];

        model.parties.push(this.createParty('partyA', values.assetAddress[0].id, values.asset[0].id, values.amount, isBuying));
        model.parties.push(this.createParty('partyB', values.recipient, values.asset[0].id, values.amount, isBuying));
    }

    private createParty(identifier, address, asset, amount, isBuying: boolean): PartyModel {
        const party = new PartyModel();

        // configure the payee
        party.partyIdentifier = identifier;
        party.sigAddress = address;
        party.mustSign = false;

        if (isBuying) {
            // configure receive list
            party.receiveList.push(this.createReceiveListItem(
                address,
                asset,
                amount,
            ));
        } else {
            // configure pay list
            party.payList.push(this.createPayListItem(
                address,
                asset,
                amount,
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
