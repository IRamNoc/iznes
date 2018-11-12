import { Component, Input, OnInit } from '@angular/core';

import { KycDetailsService } from './details.service';
import { mapValues, find, get as getValue } from 'lodash';

@Component({
    selector: 'kyc-details-stakeholders',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
})
export class KycDetailsStakeholdersComponent implements OnInit {
    @Input() set stakeholders(stakeholders) {
        if (stakeholders) {
            this.stakeholderList = stakeholders;
            this.parseStakeholders(stakeholders);
        }
    }

    get stakeholders() {
        return this.stakeholderList;
    }

    selectedStakeholder;

    stakeholderList;
    stakeholderReadableList;

    constructor(
        private detailsService: KycDetailsService,
    ) {
    }

    ngOnInit() {
    }

    selectStakeholder(stakeholder) {
        this.selectedStakeholder = stakeholder;
    }

    deselectStakeholder() {
        this.selectedStakeholder = null;
    }

    parseStakeholders(stakeholders) {
        this.stakeholderReadableList = [];

        stakeholders = stakeholders.map((stakeholder) => {
            return this.getReadableValues(stakeholder);
        });

        stakeholders.forEach((stakeholder) => {
            stakeholder.name = this.getName(stakeholder);
            stakeholder.parent = this.getParent(stakeholder);
        });

        const promises = this.getDocuments(stakeholders);

        Promise.all(promises).then(() => {
            this.stakeholderReadableList = stakeholders;
        });

    }

    getDocuments(stakeholders) {
        const promises = [];

        stakeholders.forEach((stakeholder) => {
            if (stakeholder.documentID) {
                const promise = this.detailsService.getFileByID(stakeholder.documentID).then((response) => {
                    const document = getValue(response, [1, 'Data', 0]);

                    if (document) {
                        stakeholder.fileHash = document.hash;
                        stakeholder.fileName = document.name;
                    }
                });

                promises.push(promise);
            }
        });

        return promises;
    }

    getReadableValues(stakeholder) {
        const readableStakeholder = mapValues(stakeholder, (value, key) => {
            return this.detailsService.getValueFromControl(key, value);
        });

        readableStakeholder.type = stakeholder.beneficiaryType;

        return readableStakeholder;
    }

    getParent(stakeholder) {
        const parent = stakeholder.parent;

        if (parent >= 0) {
            const parentStakeholder = find(this.stakeholderList, ['companyBeneficiariesID', parent]);

            const parentName = this.getName(parentStakeholder);

            return parentName;
        }

        return -1;
    }

    getName(stakeholder) {
        let finalName;
        const firstName = stakeholder.firstName;
        const lastName = stakeholder.lastName;

        if (!firstName && !lastName) {
            finalName = stakeholder.legalName;
        } else {
            finalName = [firstName, lastName].join(' ');
        }

        return finalName;
    }
}