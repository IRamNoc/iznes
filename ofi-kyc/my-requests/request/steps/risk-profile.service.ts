import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { mapValues, isArray, isObject, reduce, pickBy, merge, omit, fill, find, get as getValue } from 'lodash';

@Injectable()
export class RiskProfileService {
    requests;

    currentServerData = {
        risknature: new BehaviorSubject({}),
        riskobjective : new BehaviorSubject({}),
    };

    constructor(
        private newRequestService: NewRequestService,
        private requestsService : RequestsService,
    ) {
    }

    sendRequest(form, requests) {
        this.requests = requests;

        let promises = [];
        const context = this.newRequestService.context;

        this.requests.forEach((request) => {
            const kycID = request.kycID;

            // Nature
            const formGroupNature = form.get('investmentNature');
            formGroupNature.get('kycID').setValue(kycID);
            const naturePromises = this.sendRequestNature(formGroupNature);
            promises = promises.concat(naturePromises);

            // Objective
            const formGroupObjective = form.get('investmentObjective');
            const formGroupConstraint = form.get('investmentConstraint');
            formGroupObjective.get('kycID').setValue(kycID);
            formGroupConstraint.get('kycID').setValue(kycID);
            const objectivePromises = this.sendRequestObjective(formGroupObjective, formGroupConstraint);
            promises = promises.concat(objectivePromises);

            // Update step
            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestNature(formGroupNature) {
        const promises = [];
        let formGroupValue;

        const formGroupNatureValue = omit(formGroupNature.value, ['natures']);

        const kycID = formGroupNature.get('kycID').value;
        const request = find(this.requests, ['kycID', kycID]);
        const amcID = getValue(request, 'amcID');

        const naturesValue = formGroupNature.get('natures').value;

        let natureForAM;

        if (amcID) {
            natureForAM = find(naturesValue, ['assetManagementCompanyID', amcID]);
        }

        if (!natureForAM) {
            natureForAM = naturesValue[0];
            natureForAM['assetManagementCompanyID'] = amcID;
        }

        formGroupValue = merge(
            this.newRequestService.getValues(formGroupNatureValue),
            this.newRequestService.getValues(natureForAM),
        );

        const messageBody = {
            RequestName: 'updatekycrisknature',
            ...formGroupValue,
        };

        promises.push(this.requestsService.sendRequest(messageBody));

        return promises;
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
        const promises = [];
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
        return this.requestsService.getKycNature(kycID).then((formData) => {
            this.currentServerData.risknature.next(formData);
        });
    }

    getCurrentFormObjectiveData(kycID) {
        return this.requestsService.getKycObjective(kycID).then((formData) => {
            this.currentServerData.riskobjective.next(formData);
        });
    }
}