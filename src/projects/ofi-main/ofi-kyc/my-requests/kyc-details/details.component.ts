import { Component, OnDestroy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, map } from 'rxjs/operators';
import { isEmpty, find, isNil, get as getValue, findIndex, cloneDeep } from 'lodash';
import { PermissionsService } from '@setl/utils';

import { MultilingualService } from '@setl/multilingual';
import { minimalInvestorStatusTextList } from '@ofi/ofi-main/ofi-kyc/my-requests/requests.config';
import { KycDetailsService } from './details.service';
import { KycFormHelperService } from '../kyc-form-helper.service';
import { PartyCompaniesInterface } from '../kyc-form-helper';

@Component({
    selector: 'kyc-details',
    templateUrl: './details.component.html',
})
export class KycDetailsComponent implements OnInit, OnDestroy {
    @Input() set kycID(kycID: number) {
        if (kycID) {
            this.getData(kycID);
        }
    }

    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsGeneral']) kycGeneral$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsCompany']) kycCompany$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsCompanyBeneficiaries']) kycCompanyBeneficiaries$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsBanking']) kycBanking$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsClassification']) kycClassification$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsRiskNature']) kycRiskNature$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsRiskObjective']) kycRiskObjective$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsDocuments']) kycDocuments$;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsValidation']) kycValidation$;

    unsubscribe: Subject<any> = new Subject();
    panelDefs;
    stakeholders = [];
    modals = {};
    alreadyCompleted = null;

    isNowCpAm = false;
    isID2SAm = false;

    /* The companies that this user was invited by. */
    public kycPartyCompanies: PartyCompaniesInterface;

    constructor(
        private route: ActivatedRoute,
        private kycDetailsService: KycDetailsService,
        public translate: MultilingualService,
        private changeDetectorRef: ChangeDetectorRef,
        private kycFormHelperService: KycFormHelperService,
        private permissionsService: PermissionsService,
    ) {
        // Subscribe for party details.
        this.kycFormHelperService.kycPartyCompanies$
            .subscribe((data: PartyCompaniesInterface) => {
                this.kycPartyCompanies = data;
            });
    }

    async ngOnInit() {
        this.constructPanels();
        this.getBeneficiaries();

        await this.permissionsService.hasPermission('nowCpAM', 'canRead').then(
            (hasPermission) => {
                this.isNowCpAm = hasPermission;
            },
        );
        await this.permissionsService.hasPermission('id2sAM', 'canRead').then(
            (hasPermission) => {
                this.isID2SAm = hasPermission;
            },
        );
    }

    getData(kycID) {
        this.kycDetailsService.clearData();
        this.kycDetailsService.getData(kycID).then((alreadyCompleted) => {
            if (!isNil(alreadyCompleted)) {
                this.alreadyCompleted = alreadyCompleted;

                if (this.alreadyCompleted === 0) {
                    this.constructPanels();
                } else {
                    this.constructLightPanels();
                }
            }
        });
    }

    constructLightPanels() {
        this.panelDefs = [
            this.getValidation(),
        ];
    }

    constructPanels() {
        this.panelDefs = [
            this.getIdentification(),
            this.getRiskProfile(),
            this.getDocuments(),
            this.getValidation(),
        ];
    }

    open(modal) {
        this.modals[modal] = true;
    }

    getIdentification() {
        return {
            id: 'request-details-identification',
            title: this.translate.translate('Identification'),
            open: true,
            children: [
                this.getGeneral(),
                this.getCompany(),
                this.getBanking(),
                this.getClassification(),
            ],
        };
    }

    getGeneral() {
        const general = {
            title: this.translate.translate('General Information'),
            data: '',
        };

        this.kycGeneral$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            map(data => this.kycDetailsService.order(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            general.data = data;
            this.changeDetectorRef.markForCheck();
        });

        return general;
    }

    getCompany() {
        const company = {
            id: 'company',
            title: this.translate.translate('Company Information'),
            data: '',
        };

        this.kycCompany$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            map(data => this.kycDetailsService.order(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            company.data = data;
            this.changeDetectorRef.markForCheck();
        });

        return company;
    }

    getBanking() {
        const banking = {
            id: 'banking',
            title: this.translate.translate('Banking Information'),
            data: '',
            hidden: false,
        };

        this.kycBanking$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map((data: any[]) => {
                if (data.length) {
                    return data.map((bankingRow) => {
                        return this.kycDetailsService.toArray(bankingRow);
                    });
                }

                return data;
            }),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            banking.data = data;
            this.changeDetectorRef.markForCheck();
        });

        /* Hide this section is investor party selection is only ID2S. */
        if (
            this.kycPartyCompanies &&
            this.kycPartyCompanies.id2s
            && !this.kycPartyCompanies.nowcp && !this.kycPartyCompanies.iznes) {
            banking.hidden = true;
        }

        /* Hide this section if amc is id2s or nowcp */
        if (this.isID2SAm) {
            banking.hidden = true;
        }

        return banking;
    }

    getClassification() {
        const classification = {
            title: this.translate.translate('Classification Confirmation'),
            data: '',
        };

        /*
         * Hide field 'operatorsHasExperienceNeuCP' when kyc user is not NowCP
         * or 'operatorsHasExperienceNeuCP' when isNowCpAm is false
         */
        const hideOperatorsHasExperienceNeuCP = (this.kycPartyCompanies && !this.kycPartyCompanies.nowcp) && !this.isNowCpAm;

        this.kycClassification$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => cloneDeep(data)),
            map(data => conditionallyDeleteField(data, 'operatorsHasExperienceNeuCP', hideOperatorsHasExperienceNeuCP)),
            map(data => this.kycDetailsService.toArray(data)),
            map(data => this.kycDetailsService.order(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            const classificationObject = find(data, ['originalId', 'investorStatus']);
            const hasBeenAcceptedIndex = findIndex(data, ['originalId', 'classificationChangeAccepted']);
            let hasBeenAccepted = find(data, ['originalId', 'classificationChangeAccepted']);
            hasBeenAccepted = getValue(hasBeenAccepted, 'originalValue', null);

            const oldStatus = classificationObject.originalValue ? '1' : '0';
            const newStatus = classificationObject.originalValue ? '0' : '1';
            const condition = isNil(hasBeenAccepted) || !hasBeenAccepted;
            const investorClassification = condition ? find(minimalInvestorStatusTextList, ['id', oldStatus]).text : find(minimalInvestorStatusTextList, ['id', newStatus]).text;

            classification.title = `Classification Confirmation - ${investorClassification}`;

            data.splice(hasBeenAcceptedIndex, 1);
            classification.data = data;
            this.changeDetectorRef.markForCheck();
        });

        return classification;
    }

    getBeneficiaries() {
        this.kycCompanyBeneficiaries$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((beneficiaries) => {
            const promises = beneficiaries.map((beneficiary) => {
                // return this.kycDetailsService.getHashes(beneficiary);
                return beneficiary;
            });
            Promise.all(promises).then((beneficiaries) => {
                this.stakeholders = beneficiaries;
            });
        });
    }

    getRiskProfile() {
        /* Define the risk profile panels. */
        const riskProfilePanels = {
            id: 'request-details-identification',
            title: this.translate.translate('Risk Profile'),
            open: true,
            children: [
                this.getRiskNature(),
                this.getRiskObjective(),
                this.getRiskConstraint(),
            ],
            hidden: false,
        };

        /* Hide this section is investor party selection is ID2S, and not iznes. */
        if (
            this.kycPartyCompanies &&
            (this.kycPartyCompanies.id2s)
            && this.kycPartyCompanies && !this.kycPartyCompanies.nowcp) {
            riskProfilePanels.hidden = true;
        }
        /* Hide this section if amc is id2s */
        if (this.isID2SAm) {
            riskProfilePanels.hidden = true;
        }

        /* Return risk panel. */
        return riskProfilePanels;
    }

    getRiskNature() {
        const riskNature = {
            title: this.translate.translate('Investments\' Nature'),
            data: '',
            hidden: false,
        };

        this.kycRiskNature$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            riskNature.data = data;
        });

        return riskNature;
    }

    getRiskObjective() {
        const riskObjectives = {
            title: this.translate.translate('Investments\' Objectives'),
            data: '',
            hidden: false,
        };

        const ids = [
            'performanceProfile',
            'clientNeeds',
            'investmentHorizonWanted',
            'riskProfile',
            'riskProfileCapital',
            'riskAcceptanceLevel1',
            'riskAcceptanceLevel2',
            'riskAcceptanceLevel3',
            'riskAcceptanceLevel4',
        ];

        this.kycRiskObjective$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            riskObjectives.data = data.filter((row) => {
                return ids.indexOf(row.originalId) > -1;
            });
        });

        /* Hide this section is investor party selection is ID2S or nowCP, and not iznes. */
        if (
            this.kycPartyCompanies &&
            (this.kycPartyCompanies.id2s || this.kycPartyCompanies.nowcp)
            && !this.kycPartyCompanies.iznes) {
            riskObjectives.hidden = true;
        }
        /* Hide this section if amc is id2s or nowcp */
        if (this.isNowCpAm || this.isID2SAm) {
            riskObjectives.hidden = true;
        }

        return riskObjectives;
    }

    getRiskConstraint() {
        const riskContraints = {
            title: this.translate.translate('Investments\' Constraints'),
            data: '',
            hidden: false,
        };

        const ids = [
            'statutoryConstraints',
            'taxConstraints',
            'otherConstraints',
            'investmentDecisionsAdHocCommittee',
            'otherPersonsAuthorised',
            'hasEverIssuedNeuCp',
            'hasAlreadyInvestedNeuCp',
        ];

        this.kycRiskObjective$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            riskContraints.data = data.filter((row) => {
                return ids.indexOf(row.originalId) > -1;
            });
        });

        /* Hide this section is investor party selection is ID2S or nowCP, and not iznes. */
        if (
            this.kycPartyCompanies &&
            (this.kycPartyCompanies.id2s || this.kycPartyCompanies.nowcp)
            && !this.kycPartyCompanies.iznes) {
            riskContraints.hidden = true;
        }
        /* Hide this section if amc is id2s or nowcp */
        if (this.isNowCpAm || this.isID2SAm) {
            riskContraints.hidden = true;
        }


        return riskContraints;
    }

    getDocuments() {
        const documents = {
            title: this.translate.translate('Documents'),
            data: '',
        };

        this.kycDocuments$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(documents => this.kycDetailsService.extractDocuments(documents)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            documents.data = data;
        });

        return documents;
    }

    getValidation() {
        const validation = {
            title: this.translate.translate('Applicant Information'),
            data: '',
        };

        this.kycValidation$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe(async (data) => {
            await this.kycDetailsService.getHashes(data);
            validation.data = data;
            this.changeDetectorRef.markForCheck();
        });

        return validation;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}

/**
 * Conditionally delete field within kyc data.
 * @param {any} kycData
 * @param {string} fieldId
 * @param {boolean} hide
 * @return {any}
 */
function conditionallyDeleteField(kycData: any, fieldId: string, hide: boolean): any {
    if (hide) {
        delete kycData[fieldId];
    }
    return kycData;
}
