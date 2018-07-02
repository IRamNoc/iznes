import {Injectable} from '@angular/core';

import {NewRequestService} from '../new-request.service';

import {mapValues, isArray, isObject, reduce, pickBy, get as getValue, merge, omit, fill} from 'lodash';

@Injectable()
export class RiskProfileService {

    requests;

    constructor(
        private newRequestService: NewRequestService
    ) {
    }

    sendRequest(form, _requests) {
        this.requests = _requests;

        let promises = [];

        this.requests.forEach(request => {
            let kycID = request.kycID;

            let formGroupNature = form.get('investmentNature');
            formGroupNature.get('kycID').setValue(kycID);
            let naturePromise = this.sendRequestNature(formGroupNature);
            promises.push(naturePromise);

            let formGroupObjective = form.get('investmentObjective');
            let formGroupConstraint = form.get('investmentConstraint');
            formGroupObjective.get('kycID').setValue(kycID);
            formGroupConstraint.get('kycID').setValue(kycID);
            let objectivePromises = this.sendRequestObjective(formGroupObjective, formGroupConstraint);
            promises = promises.concat(objectivePromises);
        });

        return Promise.all(promises);
    }

    sendRequestNature(formGroupNature) {
        let extracted = this.getValues(formGroupNature.value);

        const messageBody = {
            Requestname: 'updatekycrisknature',
            ...extracted
        };

        return this.newRequestService.sendRequest(messageBody);
    }

    sendRequestObjective(formGroupObjective, formGroupConstraint) {
        let promises = [];
        let formGroupValue;

        let formGroupObjectiveValue = omit(formGroupObjective.value, ['objectives']);
        let formGroupconstraintsValue = omit(formGroupConstraint.value, ['constraints']);

        let objectivesValue = formGroupObjective.get('objectives').value;
        let constraintsValue = formGroupConstraint.get('constraints').value;

        let formGroupObjectiveLength = objectivesValue.length;
        let formGroupConstraintLength = constraintsValue.length;

        if (formGroupObjectiveLength > formGroupConstraintLength) {
            constraintsValue = fill(Array(formGroupObjectiveLength), constraintsValue[0]);
        } else if (formGroupConstraintLength > formGroupObjectiveLength) {
            objectivesValue = fill(Array(formGroupConstraintLength), objectivesValue[0]);
        }

        for (let i = 0; i < objectivesValue.length; i++) {
            formGroupValue = merge(
                this.getValues(formGroupObjectiveValue),
                this.getValues(formGroupconstraintsValue),
                this.getValues(objectivesValue[i]),
                this.getValues(constraintsValue[i])
            );

            const messageBody = {
                Requestname: 'updatekycriskobjective',
                ...formGroupValue
            };

            promises.push(this.newRequestService.sendRequest(messageBody));
        }


        return promises;
    }

    getValues(group) {
        return mapValues(group, single => {
            if (isArray(single)) {
                return reduce(single, (acc, curr) => {
                    let val = curr.id ? curr.id : curr;

                    return acc ? [acc, val].join(' ') : val;
                }, '')
            } else if (isObject(single)) {
                let filtered = pickBy(single);
                return Object.keys(filtered).join(' ');
            }

            return single;
        });
    }

}