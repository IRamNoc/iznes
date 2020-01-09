import { Injectable } from '@angular/core';
import { EncumbranceAddressModel } from '../models';

@Injectable()
export class EncumbranceAddressService {
    public fromJSON(json) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const encumbranceAddress = new EncumbranceAddressModel();
        encumbranceAddress.address = json[0];
        encumbranceAddress.startUTC = json[1];
        encumbranceAddress.endUTC = json[2];
        return encumbranceAddress;
    }

    public toJSON(encumbranceAddress: EncumbranceAddressModel) {
        return [
            encumbranceAddress.address,
            encumbranceAddress.startUTC,
            encumbranceAddress.endUTC,
        ];
    }
}
