import { Component, OnDestroy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, map } from 'rxjs/operators';
import { isEmpty, find, isNil, get as getValue, findIndex } from 'lodash';

import { MultilingualService } from '@setl/multilingual';
import { minimalInvestorStatusTextList } from '@ofi/ofi-main/ofi-kyc/my-requests/requests.config';
import { KycDetailsService } from './details.service';

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
    beneficiaries;
    modals = {
        beneficiaries: false,
    };

    constructor(
        private route: ActivatedRoute,
        private kycDetailsService: KycDetailsService,
        public translate: MultilingualService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    ngOnInit() {
        this.constructPanels();
        this.getBeneficiaries();
    }

    getData(kycID) {
        this.kycDetailsService.clearData();
        this.kycDetailsService.getData(kycID);
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
        let general = {
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
        .subscribe(data => {
            general.data = data;
            this.changeDetectorRef.markForCheck();
        })
        ;

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
        .subscribe(data => {
            company.data = data;
            this.changeDetectorRef.markForCheck();
        })
        ;

        return company;
    }

    getBanking() {
        const banking = {
            id: 'banking',
            title: this.translate.translate('Banking Information'),
            data: '',
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
        })
        ;

        return banking;
    }

    getClassification() {
        let classification = {
            title: this.translate.translate('Classification Confirmation'),
            data: '',
        };

        this.kycClassification$
        .pipe(
            rxFilter(value => !isEmpty(value)),
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
        })
        ;

        return classification;
    }

    getBeneficiaries() {
        this.kycCompanyBeneficiaries$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map((data: any[]) => {
                return data.map(value => this.kycDetailsService.toArray(value));
            }),
            takeUntil(this.unsubscribe),
        )
        .subscribe((beneficiaries) => {
            const promises = beneficiaries.map((beneficiary) => {
                beneficiary.splice(beneficiary.findIndex((item) => item.id == 'delete'), 1);
                return this.kycDetailsService.getHashes(beneficiary);
            });
            Promise.all(promises).then((beneficiaries) => {
                this.beneficiaries = beneficiaries;
            });
        });
    }

    getRiskProfile() {
        return {
            id: 'request-details-identification',
            title: this.translate.translate('Risk Profile'),
            open: true,
            children: [
                this.getRiskNature(),
                this.getRiskObjective(),
                this.getRiskConstraint(),
            ],
        };
    }

    getRiskNature() {
        let riskNature = {
            title: this.translate.translate('Investment\'s Nature'),
            data: '',
        };

        this.kycRiskNature$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe((data) => {
            riskNature.data = data;
        })
        ;

        return riskNature;
    }

    getRiskObjective() {
        let riskObjectives = {
            title: this.translate.translate('Investment\'s Objectives'),
            data: '',
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
        })
        ;

        return riskObjectives;
    }

    getRiskConstraint() {
        let riskContraints = {
            title: this.translate.translate('Investment\'s Constraints'),
            data: '',
        };

        const ids = [
            'statutoryConstraints',
            'taxConstraints',
            'otherConstraints',
            'investmentDecisionsAdHocCommittee',
            'otherPersonsAuthorised',
        ];

        this.kycRiskObjective$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe(data => {
            riskContraints.data = data.filter((row) => {
                return ids.indexOf(row.originalId) > -1;
            });
        })
        ;

        return riskContraints;
    }

    getDocuments() {
        let documents = {
            title: this.translate.translate('Documents'),
            data: '',
        };

        this.kycDocuments$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(documents => this.kycDetailsService.extractDocuments(documents)),
            takeUntil(this.unsubscribe),
        )
        .subscribe(data => {
            documents.data = data;
        })
        ;

        return documents;
    }

    getValidation() {
        const validation = {
            title: 'Applicant Information',
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
        })
        ;

        return validation;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
