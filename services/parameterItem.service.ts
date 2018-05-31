import { Injectable } from '@angular/core';
import { ParameterItemModel } from '../models';
@Injectable()
export class ParameterItemService {
    public fromJSON(json, key) {
        if (typeof json === 'string') {
            json = JSON.parse(json);
        }
        const parameterItem = new ParameterItemModel();
        parameterItem.key = key;
        parameterItem.address = json[0];
        parameterItem.value = json[1];
        parameterItem.calculatedIndex = json[2];
        parameterItem.contractSpecific = json[3];
        parameterItem.calculationOnly = json[4];
        parameterItem.signature = json[5];
        return parameterItem;
    }

    public toJSON(parameterItem) {
        return [
            parameterItem.address,
            parameterItem.value,
            parameterItem.calculatedIndex,
            parameterItem.contractSpecific,
            parameterItem.calculationOnly,
            parameterItem.signature,
        ];
    }
}
