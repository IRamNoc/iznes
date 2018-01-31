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
    constructor() {
        this.partyService = new PartyService();
        this.authorisationService = new AuthorisationService();
        this.parameterItemService = new ParameterItemService();
        this.encumbranceService = new EncumbranceService();
    }
    /**
     * From JSON method
     *
     * @param json
     *
     * @returns {ContractModel}
     */
    public fromJSON(json): ContractModel {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        let contract = new ContractModel();
        for (const prop in json) {
            if (contract.hasOwnProperty(prop)) {
                contract[prop] = json[prop];
            }
            console.log('Contract Property:', prop, 'Value:', json[prop]);
        }
        console.log(contract.contractdata);
        if (typeof contract.contractdata !== 'undefined' && typeof contract.contractdata.metadata !== 'undefined') {
            if (contract.contractdata.metadata !== null) {
                contract.name = JSON.parse(contract.contractdata.metadata).title;
                // contract.expiry = moment.unix(contract.contractdata.expiry).format('DD-MM-YYYY');
            }
        }
        // Parties
        if (typeof contract.contractdata.parties !== 'undefined' && contract.contractdata.parties !== null) {
            const partyCount = contract.contractdata.parties.shift();
            _.each(contract.contractdata.parties, (partyJson) => {
               this.addParty(contract, this.partyService.fromJSON(partyJson));
            });
            delete contract.contractdata.parties;
        }

        // Authorisations
        if (typeof contract.contractdata.authorisations !== 'undefined' && contract.contractdata.authorisations !== null) {
            _.each(contract.contractdata.authorisations, (authorisationJson) => {
                this.addAuthorisation(contract, this.authorisationService.fromJSON(authorisationJson));
            });
            delete contract.contractdata.authorisations;
        }

        // Parameters
        if (typeof contract.contractdata.parameters !== 'undefined' && contract.contractdata.parameters !== null) {
            _.each(contract.contractdata.parameters, (parameterJson, parameterKey) => {
                this.addParameter(contract, this.parameterItemService.fromJSON(parameterJson, parameterKey));
            });
            delete contract.contractdata.parameters;
        }

        // Encumbrances
        if (typeof contract.contractdata.addencumbrances !== 'undefined' && contract.contractdata.addencumbrances !== null) {
            _.each(contract.contractdata.addencumbrances, (encumbranceJson) => {
                this.addEncumbrance(contract, this.encumbranceService.fromJSON(encumbranceJson));
            });
            delete contract.contractdata.addencumbrances;
        }

        for (const prop in contract.contractdata) {
            if (contract.hasOwnProperty(prop)) {
                console.log(prop, ' = ', contract.contractdata[prop]);
                contract[prop] = contract.contractdata[prop];
            }
        }
        contract.function = contract.contractdata.__function;
        delete contract.contractdata;

        contract.complete = true;
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
                delete contract[contractDataFields[index]];
            } else {
                contractJsonObject.contractdata[contractDataFields[index]] = contract[contractDataFields[index]];
            }
        }

        for (let contractField in contract) {
            if (contractDataFields.indexOf(contractField) === -1) {
                contractJsonObject[contractField] = contract[contractField];
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
        contract.parameters.push(parameter);
    }

    public addEncumbrance(contract: ContractModel, encumbrance: EncumbranceModel): void {
        contract.addencumbrances.push(encumbrance);
    }

    public convertSubModels(subModels) {
        if (typeof subModels === 'undefined') {
            return;
        }
        let jsonArray = [];
        _.each(subModels, (subModel) => {
            switch (subModel.constructor.name) {
                case 'AuthorisationModel':
                    jsonArray.push(this.authorisationService.toJSON(subModel));
                    break;
                case 'ParameterItemModel':
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
}
