import { Injectable } from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';
import * as moment from 'moment';

import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';

import { mapValues, isArray, isObject, reduce, pickBy, merge, omit, fill, find, get as getValue } from 'lodash';

@Injectable()
export class RiskProfileService {

    requests;

    currentServerData = {
        'riskobjective' : new BehaviorSubject({})
    };

    constructor(
        private newRequestService: NewRequestService,
        private requestsService : RequestsService,
    ) {
    }

    sendRequest(form, argRequests) {
        this.requests = argRequests;

        const promises = [];
        const context = this.newRequestService.context;

        this.requests.forEach((request) => {
            const kycID = request.kycID;

            const formGroupNature = form.get('investmentNature');
            formGroupNature.get('kycID').setValue(kycID);
            const naturePromise = this.sendRequestNature(formGroupNature);
            promises.push(naturePromise);

            const formGroupObjective = form.get('investmentObjective');
            const formGroupConstraint = form.get('investmentConstraint');
            formGroupObjective.get('kycID').setValue(kycID);
            formGroupConstraint.get('kycID').setValue(kycID);
            const objectivePromise = this.sendRequestObjective(formGroupObjective, formGroupConstraint);
            promises.push(objectivePromise);

            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestNature(formGroupNature) {
        const extracted = this.newRequestService.getValues(formGroupNature.value);

        const messageBody = {
            RequestName: 'updatekycrisknature',
            ...extracted,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, context) {
        const messageBody = {
            RequestName : 'iznesupdatecurrentstep',
            kycID,
            completedStep : 'riskProfile',
            currentGroup : context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestObjective(formGroupObjective, formGroupConstraint) {
        let formGroupValue;

        const formGroupObjectiveValue = omit(formGroupObjective.value, ['objectives']);
        const formGroupconstraintsValue = omit(formGroupConstraint.value, ['constraints']);

        const objectivesValue = formGroupObjective.get('objectives').value;
        const constraintsValue = formGroupConstraint.get('constraints').value;

        const kycID = formGroupObjective.get('kycID').value;
        const request = find(this.requests, ['kycID', kycID]);
        const amcID = getValue(request, 'amcID');

        let objectiveForAM;
        let constraintForAM;

        if (amcID) {
            objectiveForAM = find(objectivesValue, ['assetManagementCompanyID', amcID]);
            constraintForAM = find(constraintsValue, ['assetManagementCompanyID', amcID]);
        }
        if (!objectiveForAM) {
            objectiveForAM = objectivesValue[0];
            objectiveForAM['assetManagementCompanyID'] = amcID;
        }
        if (!constraintForAM) {
            constraintForAM = constraintsValue[0];
            constraintForAM['assetManagementCompanyID'] = amcID;
        }

        formGroupValue = merge(
            this.newRequestService.getValues(formGroupObjectiveValue),
            this.newRequestService.getValues(formGroupconstraintsValue),
            this.newRequestService.getValues(objectiveForAM),
            this.newRequestService.getValues(constraintForAM),
        );

        formGroupValue = merge(
            omit(formGroupValue, 'riskAcceptance'),
            objectiveForAM.riskAcceptance,
        );

        const messageBody = {
            RequestName: 'updatekycriskobjective',
            ...formGroupValue,
        };

        return this.requestsService.sendRequest(messageBody);

    }

    getCurrentFormNatureData(kycID) {
        return this.requestsService.getKycNature(kycID);
    }

    getCurrentFormObjectiveData(kycID) {
        return this.requestsService.getKycObjective(kycID).then((formData) => {
            this.currentServerData.riskobjective.next(formData);
        });
    }
}