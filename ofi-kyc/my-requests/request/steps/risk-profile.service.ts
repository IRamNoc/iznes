import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject} from 'rxjs';
import * as moment from 'moment';

import {RequestsService} from '../../requests.service';
import {NewRequestService} from '../new-request.service';

import {mapValues, isArray, isObject, reduce, pickBy, merge, omit, fill, find, get as getValue} from 'lodash';

@Injectable()
export class RiskProfileService {

    requests;

    currentServerData = {
        'riskobjective' : new BehaviorSubject({})
    };

    constructor(
        private newRequestService: NewRequestService,
        private requestsService : RequestsService
    ) {
    }

    sendRequest(form, _requests) {
        this.requests = _requests;

        let promises = [];
        let context = this.newRequestService.context;

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

            let updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    sendRequestNature(formGroupNature) {
        let extracted = this.newRequestService.getValues(formGroupNature.value);

        const messageBody = {
            RequestName: 'updatekycrisknature',
            ...extracted
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestUpdateCurrentStep(kycID, context){
        const messageBody = {
            RequestName : 'iznesupdatecurrentstep',
            kycID : kycID,
            completedStep : 'riskProfile',
            currentGroup : context
        };

        return this.requestsService.sendRequest(messageBody);
    }

    sendRequestObjective(formGroupObjective, formGroupConstraint) {
        let promises = [];
        let formGroupValue;

        let formGroupObjectiveValue = omit(formGroupObjective.value, ['objectives']);
        let formGroupconstraintsValue = omit(formGroupConstraint.value, ['constraints']);

        let objectivesValue = formGroupObjective.get('objectives').value;
        let constraintsValue = formGroupConstraint.get('constraints').value;

        let kycID = formGroupObjective.get('kycID').value;
        let request = find(this.requests, ['kycID', kycID]);
        let amcID = getValue(request, 'amcID');

        let objectiveForAM;
        let constraintForAM;

        if(amcID){
            objectiveForAM = find(objectivesValue, ['assetManagementCompanyID', amcID]);
            constraintForAM = find(constraintsValue, ['assetManagementCompanyID', amcID]);
        }
        if(!objectiveForAM){
            objectiveForAM = objectivesValue[0];
            objectiveForAM['assetManagementCompanyID'] = amcID;
        }
        if(!constraintForAM){
            constraintForAM = constraintsValue[0];
            constraintForAM['assetManagementCompanyID'] = amcID;
        }


        formGroupValue = merge(
            this.newRequestService.getValues(formGroupObjectiveValue),
            this.newRequestService.getValues(formGroupconstraintsValue),
            this.newRequestService.getValues(objectiveForAM),
            this.newRequestService.getValues(constraintForAM)
        );

        formGroupValue = merge(
            omit(formGroupValue, 'riskAcceptance'),
            objectiveForAM.riskAcceptance
        );

        const messageBody = {
            RequestName: 'updatekycriskobjective',
            ...formGroupValue
        };

        promises.push(this.requestsService.sendRequest(messageBody));

        return promises;
    }

    getCurrentFormNatureData(kycID){
        return this.requestsService.getKycNature(kycID);
    }

    getCurrentFormObjectiveData(kycID){
        return this.requestsService.getKycObjective(kycID).then(formData => {
            this.currentServerData.riskobjective.next(formData);
        });
    }
}