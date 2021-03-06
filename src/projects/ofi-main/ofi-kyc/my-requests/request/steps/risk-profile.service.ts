import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { mapValues, isArray, isObject, reduce, pickBy, merge, omit, fill, find, get as getValue } from 'lodash';
import { MyUserService } from '../../../../../core-req-services';

@Injectable()
export class RiskProfileService {
    requests;

    currentServerData = {
        risknature: new BehaviorSubject({}),
        riskobjective: new BehaviorSubject({}),
    };

    constructor(
        private newRequestService: NewRequestService,
        private requestsService : RequestsService,
        private myUserService: MyUserService,
    ) {
        this.handleOnLogOut();
    }

    sendRequestInvestmentNature(form, requests) {
        this.requests = requests;

        let promises = [];
        const context = this.newRequestService.context;

        this.requests.forEach((request) => {
            const kycID = request.kycID;

            // Nature
            form.get('kycID').setValue(kycID);
            const naturePromises = this.sendRequestNature(form);
            promises = promises.concat(naturePromises);

            // Update step
            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, 'investmentDetails', context);
            promises.push(updateStepPromise);
        });

        return new Promise((resolve, reject) => {
            Promise.all(promises)
            .then(() => {
                this.requests.forEach((request) => {
                    this.getCurrentFormNatureData(request.kycID);
                });
                resolve();
            })
            .catch((e) => {
                reject(e);
            });
        })
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

    sendRequestInvestmentObjective(formObjective, formConstraint, requests, completedStep) {

        this.requests = requests;

        let promises = [];
        const context = this.newRequestService.context;

        this.requests.forEach(async (request) => {
            const kycID = request.kycID;

            // Objective
            const formGroupObjective = formObjective;
            const formGroupConstraint = formConstraint;
            formGroupObjective.get('kycID').setValue(kycID);
            formGroupConstraint.get('kycID').setValue(kycID);
            const objectivePromises = await this.sendRequestObjective(formGroupObjective, formGroupConstraint);
            promises = promises.concat(objectivePromises);

            // Update step
            const updateStepPromise = this.sendRequestUpdateCurrentStep(kycID, completedStep, context);
            promises.push(updateStepPromise);
        });

        return Promise.all(promises);
    }

    async sendRequestObjective(formGroupObjective, formGroupConstraint) {
        const promises = [];
        let formGroupValue;

        const formGroupObjectiveValue = omit(formGroupObjective.value, ['objectives']);
        const formGroupconstraintsValue = omit(formGroupConstraint.value, ['constraints']);

        const objectivesValue = formGroupObjective.get('objectives').value;
        const constraintsValue = formGroupConstraint.get('constraints').value;

        const kycID = formGroupObjective.get('kycID').value;
        const request = find(this.requests, ['kycID', kycID]);
        const amcID = getValue(request, 'amcID');

        // The request to update data for 'Risk constraints', would need data from 'Risk objectives' as well. we just mock the
        // 'Risk objectives' form control to make the current flow work.
        if (objectivesValue.length === 0) {
            const invObjectiveForm = await this.newRequestService.createInvestmentObjective(amcID);
            objectivesValue.push(
                invObjectiveForm.value,
            );
        }

        // The request to update data for 'Risk objects', would need data from 'Risk constraints' as well. we just mock the
        // 'Risk constraints' form control to make the current flow work.
        if (constraintsValue.length === 0) {
            const invConstraintForm = await this.newRequestService.createConstraint(amcID);
            constraintsValue.push(
                invConstraintForm.value,
            );
        }

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

    sendRequestUpdateCurrentStep(kycID, completedStep, context) {
        const messageBody = {
            RequestName: 'iznesupdatecurrentstep',
            kycID,
            completedStep,
            currentGroup: context,
        };

        return this.requestsService.sendRequest(messageBody);
    }

    /**
     * Clear currentServerData state on Logout
     *
     * @returns {void}
     */
    private handleOnLogOut(): void {
        this.myUserService.logout$.subscribe(() => {
            this.currentServerData.risknature.next({});
            this.currentServerData.riskobjective.next({});
        });
    }
}
