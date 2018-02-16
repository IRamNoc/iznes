import { Injectable } from '@angular/core';
import { ContractModel } from '@setl/core-contracts/models/contract.model';
import { PartyService } from '@setl/core-contracts/services/party.service';
import { PartyModel } from '@setl/core-contracts/models/party.model';
import { AuthorisationService } from '@setl/core-contracts/services/authorisation.service';
import { AuthorisationModel } from '@setl/core-contracts/models/authorisation.model';
import { ParameterItemService } from '@setl/core-contracts/services/parameterItem.service';
import { ParameterItemModel } from '@setl/core-contracts/models/parameterItem.model';
import { EncumbranceService } from '@setl/core-contracts/services/encumbrance.service';
import { EncumbranceModel } from '@setl/core-contracts/models/encumbrance.model';
import * as moment from 'moment';
import _ from 'lodash';

@Injectable()
export class ContractService {
    private partyService: PartyService;
    private authorisationService: AuthorisationService;
    private parameterItemService: ParameterItemService;
    private encumbranceService: EncumbranceService;
    public addresses: Array<any> = new Array();
    constructor() {
        this.partyService = new PartyService();
        this.authorisationService = new AuthorisationService();
        this.parameterItemService = new ParameterItemService();
        this.encumbranceService = new EncumbranceService();
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
        this.addresses = addresses;
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let contract = new ContractModel();
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

        // Parties
        if (typeof contract.parties !== 'undefined' && contract.parties !== null) {
            if (typeof contract.parties[0] === 'number') {
                contract.parties.shift();
            }
            contract.payors = '';
            contract.payees = '';
            _.each(contract.parties, (partyJson, partyIndex) => {
                if (typeof partyJson !== 'number') {
                    contract.parties[partyIndex] = this.partyService.fromJSON(partyJson);
                    if (contract.parties[partyIndex].payList.length > 0) {
                        _.each(contract.parties[partyIndex].payList, (payListItem) => {
                            contract.payors += payListItem.quantity.toFixed(2) + ' ' + this.getAddressLabel(payListItem.address) + ',';
                        });
                    }
                    if (contract.parties[partyIndex].receiveList.length > 0) {
                        _.each(contract.parties[partyIndex].receiveList, (receiveListItem) => {
                            contract.payees += receiveListItem.quantity.toFixed(2) + ' ' + this.getAddressLabel(receiveListItem.address) + ',';
                        });
                    }
                    contract.parties[partyIndex].sigAddress_label = this.getAddressLabel(contract.parties[partyIndex].sigAddress);
                }
            });
            contract.payors = contract.payors.substr(0, contract.payors.length-1);
            contract.payees = contract.payees.substr(0, contract.payees.length-1);
            contract.name = contract.__address;
            contract.issuingaddress_label = this.getAddressLabel(contract.issuingaddress);
            contract.fromaddr_label = this.getAddressLabel(contract.fromaddr);
            contract.toaddr_label = this.getAddressLabel(contract.toaddr);
            contract.status = 'Pending';
        }

        // Authorisations
        if (typeof contract.authorisations !== 'undefined' && contract.authorisations !== null) {
            _.each(contract.authorisations, (authorisationJson, authorisationIndex) => {
                contract.authorisations[authorisationIndex] = this.authorisationService.fromJSON(authorisationJson);
            });
        }

        // Parameters
        if (typeof contract.parameters !== 'undefined' && contract.parameters !== null) {
            _.each(contract.parameters, (parameterJson, parameterKey) => {
                contract.parameters[parameterKey] = this.parameterItemService.fromJSON(parameterJson, parameterKey);
            });
        }

        // Encumbrances
        if (typeof contract.addencumbrances !== 'undefined' && contract.addencumbrances !== null) {
            _.each(contract.addencumbrances, (encumbranceJson, encumbranceIndex) => {
                contract.addencumbrances[encumbranceIndex] = this.encumbranceService.fromJSON(encumbranceJson);
            });
        }

        contract.address = contract.__address;
        contract.function = contract.__function;
        contract.completed = contract.__completed == 0;
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

        let contractJsonObject: any = {
            contractdata: {}
        };

        for (let index in contractDataFields) {
            if (stringifyDataFields.indexOf(contractDataFields[index]) !== -1 &&
                typeof contract[contractDataFields[index]] !== 'undefined'
            ) {
                contractJsonObject.contractdata[contractDataFields[index]] = this.convertSubModels(contract[contractDataFields[index]]);
            } else {
                contractJsonObject.contractdata[contractDataFields[index]] = contract[contractDataFields[index]];
            }
        }

        if (typeof contract.function !== 'undefined') {
            contractJsonObject.contractdata.__function = contract.function;
            delete contractJsonObject.contractdata.function;
        }

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
        contract.parameters[parameter.key] = [
            parameter.address,
            parameter.value,
            parameter.calculatedIndex,
            parameter.contractSpecific,
            parameter.calculationOnly,
            parameter.signature
        ];
    }

    public addEncumbrance(contract: ContractModel, encumbrance: EncumbranceModel): void {
        contract.addencumbrances.push(encumbrance);
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
                    jsonArray = {}
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
        for (let i = 0; i < arguments.length; i++) {
            arguments[i] = JSON.parse(JSON.stringify(arguments[i]));
        }
        console.log.apply(this, arguments);
    }
}
