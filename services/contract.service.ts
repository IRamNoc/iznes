import { Injectable } from '@angular/core';
import { PartyService } from '../services/party.service';
import { AuthorisationService } from '../services/authorisation.service';
import {
    AuthorisationModel,
    ParameterItemModel,
    PayListItemModel,
    ReceiveListItemModel,
    EncumbranceModel,
    UseEncumbranceModel,
    PartyModel,
    ContractModel
} from '../models';
import { ParameterItemService } from '../services/parameterItem.service';
import { EncumbranceService } from '../services/encumbrance.service';
import { SagaHelper } from '@setl/utils';
import * as moment from 'moment';
import * as _ from 'lodash';
import { NgRedux, select } from '@angular-redux/store';
import { WalletNodeRequestService } from '@setl/core-req-services';

@Injectable()
export class ContractService {
    private partyService: PartyService;
    private authorisationService: AuthorisationService;
    private parameterItemService: ParameterItemService;
    private encumbranceService: EncumbranceService;
    public addresses: string[] = [];
    private walletId: number;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletId$;

    constructor(
        private walletNodeRequest: WalletNodeRequestService,
        private redux: NgRedux<any>,
    ) {
        this.partyService = new PartyService();
        this.authorisationService = new AuthorisationService();
        this.parameterItemService = new ParameterItemService();
        this.encumbranceService = new EncumbranceService();

        this.connectedWalletId$.subscribe(id => this.walletId = id);
    }

    /**
     * From JSON method
     *
     * @param {object} json
     * @param {array}  addresses
     *
     * @returns {ContractModel}
     */
    public fromJSON(json, addresses): ContractModel {
        console.log('Contract JSON', json);
        this.addresses = addresses;
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const contract = new ContractModel();
        for (const prop in json) {
            if (contract.hasOwnProperty(prop)) {
                contract[prop] = JSON.parse(JSON.stringify(json[prop]));
            }
        }
        // If contractdata object is present, move all members to root
        if (typeof contract.contractdata !== 'undefined') {
            for (const contractdataProp in contract.contractdata) {
                if (contract.hasOwnProperty(contractdataProp)) {
                    contract[contractdataProp] = JSON.parse(JSON.stringify(json[contractdataProp]));
                }
            }
            delete contract.contractdata;
        }

        if (json.hasOwnProperty('encumbrance')) {
            contract.encumbrance.use = json.encumbrance[0];
            contract.encumbrance.reference = json.encumbrance[1];
        }

        // Parties
        if (typeof contract.parties !== 'undefined' && contract.parties !== null) {
            if (typeof contract.parties[0] === 'number') {
                contract.parties.shift();
            }
            contract.payors = [];
            contract.payees = [];
            contract.status = (contract.__completed === -1) ? 'Completed' : 'Pending';

            _.each(contract.parties, (partyJson, partyIndex) => {
                if (typeof partyJson !== 'number') {
                    contract.parties[partyIndex] = this.partyService.fromJSON(partyJson);
                    if (contract.parties[partyIndex].payList.length > 0) {
                        contract.payors[partyIndex] = '';
                        _.each(contract.parties[partyIndex].payList, (payListItem) => {
                            if (typeof payListItem.quantity !== 'undefined') {
                                contract.payors[partyIndex] += (+payListItem.quantity).toFixed(2) +
                                    ' ' + payListItem.assetId + ' | ' + payListItem.namespace;
                            }
                        });
                    }

                    if (contract.parties[partyIndex].receiveList.length > 0) {
                        contract.payees[partyIndex] = '';
                        _.each(contract.parties[partyIndex].receiveList, (receiveListItem) => {
                            if (typeof receiveListItem.quantity !== 'undefined') {
                                contract.payees[partyIndex] += (+receiveListItem.quantity)
                                    .toFixed(2) +
                                    ` ${receiveListItem.assetId} | ${receiveListItem.namespace}`;
                            }
                        });
                    }
                    contract.parties[partyIndex].sigAddress_label = this.getAddressLabel(
                        contract.parties[partyIndex].sigAddress,
                    );
                }
            });
            contract.name = contract.__address;
            contract.issuingaddress_label = this.getAddressLabel(contract.issuingaddress);
            contract.fromaddr_label = this.getAddressLabel(contract.fromaddr);
            contract.toaddr_label = this.getAddressLabel(contract.toaddr);

        }

        // Authorisations
        if (typeof contract.authorisations !== 'undefined' && contract.authorisations !== null) {
            _.each(contract.authorisations, (authorisationJson, authorisationIndex) => {
                contract.authorisations[authorisationIndex] = this.authorisationService.fromJSON(
                    authorisationJson,
                );
            });
        }

        // Parameters
        if (typeof contract.parameters !== 'undefined' && contract.parameters !== null) {
            let parameterIndex = 0;
            const parameters = contract.parameters;
            contract.parameters = [];
            _.each(parameters, (parameterJson, parameterKey) => {
                contract.parameters[parameterIndex] = this.parameterItemService.fromJSON(
                    parameterJson,
                    parameterKey,
                );
                parameterIndex += 1;
            });
        }

        // Encumbrances
        if (typeof contract.addencumbrances !== 'undefined' && contract.addencumbrances !== null) {
            _.each(contract.addencumbrances, (encumbranceJson, encumbranceIndex) => {
                contract.addencumbrances[encumbranceIndex] = this.encumbranceService.fromJSON(
                    encumbranceJson,
                );
            });
        }

        contract.address = contract.__address;
        contract.function = contract.__function;
        contract.completed = contract.__completed !== 0;
        contract.timeevent = contract.__timeevent;
        return contract;
    }

    public toJSON(contract: ContractModel) {
        const contractDataFields = [
            'authorisations',
            'function',
            'parameters',
            'startdate',
            'protocol',
            'expiry',
            'parties',
            'encumbrance',
            'addencumbrances',
            'encumbrance',
            'issuingaddress',
            'events',
            'metadata',
            'function',
        ];

        const stringifyDataFields = [
            'authorisations',
            'parameters',
            'parties',
            'addencumbrances',
        ];

        const contractJsonObject: any = {
            contractdata: {},
        };

        for (const index in contractDataFields) {
            if (stringifyDataFields.indexOf(contractDataFields[index]) !== -1 &&
                typeof contract[contractDataFields[index]] !== 'undefined'
            ) {
                contractJsonObject.contractdata[contractDataFields[index]]
                    = this.convertSubModels(contract[contractDataFields[index]]);
            } else {
                contractJsonObject.contractdata[contractDataFields[index]]
                    = contract[contractDataFields[index]];
            }
        }

        if (typeof contract.function !== 'undefined') {
            contractJsonObject.contractdata.__function = contract.function;
            delete contractJsonObject.contractdata.function;
        }

        contractJsonObject.contractdata.metadata = '{}';

        delete contractJsonObject.events;

        return JSON.stringify(contractJsonObject);
    }

    public addParty(contract: ContractModel, party: PartyModel): void {
        contract.parties.push(party);
    }

    public addAuthorisation(contract: ContractModel, authorisation: AuthorisationModel): void {
        contract.authorisations.push(authorisation);
    }

    public addParameter(contract: ContractModel, parameter: ParameterItemModel): void {
        contract.parameters.push(parameter);
    }

    public addEncumbrance(contract: ContractModel, encumbrance: EncumbranceModel): void {
        contract.addencumbrances.push(encumbrance);
    }

    public commitParty(party: PartyModel, contract: ContractModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const contractJson = JSON.parse(this.toJSON(contract)).contractdata;
            const commitment = party.payList.map((item: PayListItemModel, idx) => {
                return [idx, item.namespace, item.assetId, item.quantity, '', ''];
            });
            const receive = party.receiveList.map((item: ReceiveListItemModel, idx) => {
                return [idx, party.sigAddress];
            });
            const asyncTaskPipe = this.walletNodeRequest.walletCommitToContract({
                walletid: this.walletId,
                address: party.sigAddress,
                function: contract.function + '_commit',
                contractdata: {
                    commitment,
                    receive,
                    contractfunction: contract.function + '_commit',
                    issuingaddress: contract.issuingaddress,
                    contractaddress: contract.address,
                    party: [
                        party.partyIdentifier,
                        '',
                        '',
                    ],
                    parties: contractJson.parties,
                },
                contractaddress: contract.address,
            });
            this.redux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    resolve(data);
                },
                (data) => {
                    reject(data);
                }
            ));
        });
    }

    public commitAuthorisation(index: number, contract: ContractModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const contractJson = JSON.parse(this.toJSON(contract)).contractdata;
            const address = contractJson.authorisations[index][0];
            const commitment = [];
            commitment[0] = [index, contractJson.authorisations[index][0]];
            const authorise = [contractJson.authorisations[index]];

            const asyncTaskPipe = this.walletNodeRequest.walletCommitToContract({
                walletid: this.walletId,
                address,
                function: `${contract.function}_commit`,
                contractdata: {
                    commitment,
                    contractfunction: `${contract.function}_commit`,
                    issuingaddress: contract.issuingaddress,
                    contractaddress: contract.address,
                    parties: contractJson.parties,
                    authorise,
                },
                contractaddress: contract.address,
            });

            this.redux.dispatch(SagaHelper.runAsync(
                [],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    resolve(data);
                },
                (data) => {
                    reject(data);
                },
            ));
        });
    }

    public commitParameter(key: string, value: any, contract: ContractModel): Promise<any> {
        return new Promise((resolve, reject) => {
            const contractJson = JSON.parse(this.toJSON(contract)).contractdata;
            // const commitment = party.payList.map((item: PayListItemModel, idx) => {
            //     return [idx, item.namespace, item.assetId, item.quantity, '', ''];
            // });
            // const receive = party.receiveList.map((item: ReceiveListItemModel, idx) => {
            //     return [idx, party.sigAddress];
            // });
            // const asyncTaskPipe = this.walletNodeRequest.walletCommitToContract({
            //     walletid: this.walletId,
            //     address: party.sigAddress,
            //     function: contract.function + '_commit',
            //     contractdata: {
            //         commitment,
            //         receive,
            //         contractfunction: contract.function + '_commit',
            //         issuingaddress: contract.issuingaddress,
            //         contractaddress: contract.address,
            //         // party: [
            //         //     party.partyIdentifier,
            //         //     '',
            //         //     '',
            //         // ],
            //         parameters: contractJson.parameters
            //     },
            //     contractaddress: contract.address,
            // });
            // this.redux.dispatch(SagaHelper.runAsync(
            //     [],
            //     [],
            //     asyncTaskPipe,
            //     {},
            //     (data) => {
            //         resolve(data);
            //     },
            //     (data) => {
            //         reject(data);
            //     }
            // ));
        });
    }

    public convertSubModels(subModels) {
        if (typeof subModels === 'undefined') {
            return;
        }
        let jsonArray: any = [];
        _.each(subModels, (subModel) => {
            switch (subModel.constructor.name) {
            case 'AuthorisationModel':
                jsonArray.push(this.authorisationService.toJSON(subModel));
                break;
            case 'ParameterItemModel':
                jsonArray = {};
                jsonArray[subModel.key] = this.parameterItemService.toJSON(subModel);
                break;
            case 'PartyModel':
                if (jsonArray.length === 0) {
                    jsonArray.push(subModels.length);
                }
                jsonArray.push(this.partyService.toJSON(subModel));
                break;
            case 'EncumbranceModel':
                jsonArray.push(this.encumbranceService.toJSON(subModel));
                break;
            }
        });
        return jsonArray;
    }

    public getAddressLabel(address: string) {
        if (typeof this.addresses[address] !== 'undefined') {
            return this.addresses[address].label;
        }
        return address;
    }

    public debugLog() {
        for (let i = 0; i < arguments.length; i += 1) {
            arguments[i] = JSON.parse(JSON.stringify(arguments[i]));
        }
        console.log.apply(this, arguments);
    }
}
