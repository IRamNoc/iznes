import { Injectable } from '@angular/core';
import { ContractModel } from '@setl/core-contracts/models/contract.model';
import * as moment from 'moment';
import { JsonDataService } from "@setl/core-contracts/services/jsonDataAbstract.service";

@Injectable()
export class ContractService extends JsonDataService {
    /**
     * From JSON method
     *
     * @param json
     *
     * @returns {Contract}
     */
    public fromJSON(json) {
        let contract = super.fromJSON(json, new ContractModel());
        if (typeof contract.contractdata !== 'undefined' && typeof contract.contractdata.metadata !== 'undefined') {
            if (contract.contractdata.metadata !== null) {
                contract.name = JSON.parse(contract.contractdata.metadata).title;
                contract.expiry = moment.unix(contract.contractdata.expiry).format('DD-MM-YYYY');
            }
        }
        // Parties
        if (typeof contract.contractdata.parties !== 'undefined' && contract.contractdata.parties !== null) {

        }

        // Authorisations

        // Parameters

        // Encumbrances

        contract.complete = true;
        return contract;
    }
}