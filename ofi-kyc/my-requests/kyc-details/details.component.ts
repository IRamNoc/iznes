import { Component, OnDestroy, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, map, tap } from 'rxjs/operators';
import { isEmpty } from 'lodash';

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
            title: 'Identification',
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
            title: 'General Information',
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
            title: 'Company Information',
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
            title: 'Banking Information',
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
        const classification = {
            title: 'Classification Confirmation',
            data: '',
        };

        this.kycClassification$
        .pipe(
            rxFilter(value => !isEmpty(value)),
            map(data => this.kycDetailsService.toArray(data)),
            takeUntil(this.unsubscribe),
        )
        .subscribe(data => {
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
            title: 'Risk Profile',
            open: true,
            children: [
                this.getRiskNature(),
                this.getRiskObjective(),
                this.getRiskConstraint(),
            ],
        };
    }

    getRiskNature() {
        const riskNature = {
            title: 'Investment\'s Nature',
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
        const riskObjectives = {
            title: 'Investment\'s Objectives',
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
        const riskContraints = {
            title: 'Investment\'s Constraints',
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
        const documents = {
            title: 'Documents',
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
