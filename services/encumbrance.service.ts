import { Injectable } from '@angular/core';
import { EncumbranceModel } from '../models';
import { EncumbranceAddressModel } from '../models';
import { EncumbranceAddressService } from '../services/encumbranceAddress.service';
import * as _ from 'lodash';

@Injectable()
export class EncumbranceService {
    private encumbranceAddressService: EncumbranceAddressService;
    public constructor() {
        this.encumbranceAddressService = new EncumbranceAddressService();
    }

    public fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const encumbrance = new EncumbranceModel();
        encumbrance.publicKey = json[0];
        encumbrance.fullAssetId = json[1];
        encumbrance.reference = json[2];
        encumbrance.amount = json[3];
        _.each(json[4], (beneficiaryJson) => {
            encumbrance.beneficiaries.push(
                this.encumbranceAddressService.fromJSON(beneficiaryJson),
            );
        });
        _.each(json[5], (administratorJson) => {
            encumbrance.administrators.push(
                this.encumbranceAddressService.fromJSON(administratorJson),
            );
        });
        encumbrance.signature = json[6];
        return encumbrance;
    }

    public toJSON(encumbrance: EncumbranceModel) {
        return [
            encumbrance.publicKey,
            encumbrance.fullAssetId,
            encumbrance.reference,
            encumbrance.amount,
            _.map(encumbrance.beneficiaries, this.encumbranceAddressService.toJSON),
            _.map(encumbrance.administrators, this.encumbranceAddressService.toJSON),
            encumbrance.signature,
        ];
    }
}
