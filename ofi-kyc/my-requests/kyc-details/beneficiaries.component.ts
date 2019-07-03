import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { select } from '@angular-redux/store';
import { KycDetailsService } from './details.service';
import { isEmpty, mapValues, find, get as getValue } from 'lodash';
import { filter, take, filter as rxFilter, map } from 'rxjs/operators';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'kyc-details-stakeholders',
    templateUrl: './beneficiaries.component.html',
    styleUrls: ['./beneficiaries.component.scss'],
})
export class KycDetailsStakeholdersComponent implements OnInit {
    @select(['user', 'myDetail', 'userId']) user$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsGeneral']) kycGeneral$;

    @Input() set stakeholders(stakeholders) {
        if (stakeholders) {
            this.getRegisteredCompanyName();
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

    userID;
    registeredCompanyName;

    constructor(
        private detailsService: KycDetailsService,
        private translateService: MultilingualService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.getUserID();
        this.getRegisteredCompanyName();
    }

    getUserID() {
        this.user$.pipe(
            filter(userID => !!userID),
            take(1),
        ).subscribe((userID) => {
            this.userID = userID;
        });
    }

    getRegisteredCompanyName() {
        this.kycGeneral$
            .pipe(
                rxFilter(value => !isEmpty(value)),
                map(data => this.detailsService.toArray(data)),
                map(data => this.detailsService.order(data)),
            )
            .subscribe((data) => {
                this.registeredCompanyName = data.filter((item) => {
                    return item.originalId === 'registeredCompanyName';
                })[0].value;
                this.changeDetectorRef.markForCheck();
            });
    }

    selectStakeholder(stakeholder) {
        this.selectedStakeholder = stakeholder;
    }

    deselectStakeholder() {
        this.selectedStakeholder = null;
    }

    exportStakeholders() {
        const kycID = getValue(this.stakeholderList, [0, 'kycID']);

        if (kycID) {
            this.detailsService.exportStakeholders(kycID, this.userID, this.registeredCompanyName);
        }
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

        if (parent === -1) {
            return this.registeredCompanyName;
        }

        const parentStakeholder = find(this.stakeholderList, ['companyBeneficiariesID', parent]);

        if ((parent != undefined) && parent >= 0 && (typeof parentStakeholder !== 'undefined')) {
            const parentName = this.getName(parentStakeholder);

            return parentName;
        }
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
