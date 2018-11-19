import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, NgRedux } from '@angular-redux/store';
import { map, sort, remove, find } from 'lodash';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, take, filter as rxFilter, map as rxMap } from 'rxjs/operators';

import { clearMyKycRequestedPersist } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { MultilingualService } from '@setl/multilingual';
import { FormStepsDirective } from '@setl/utils/directives/form-steps/formsteps';
import { NewRequestService } from './new-request.service';

@Component({
    templateUrl: './new-request.component.html',
    styleUrls: ['./new-request.component.scss'],
})
export class NewKycRequestComponent implements OnInit {

    @ViewChild(FormStepsDirective) formSteps;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    unsubscribe: Subject<any> = new Subject();
    stepsConfig: any;
    forms: any = {};

    fullForm = true;
    currentCompletedStep;
    documentRules = {
        isListed: null,
        isFloatableHigh: null,
        isRegulated: null,
    };
    duplicate;
    duplicateCompany = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private newRequestService: NewRequestService,
        public translate: MultilingualService,
        private ngRedux: NgRedux<any>,
        private router: Router,
        private location: Location,
    ) {
    }

    get documents() {
        const isListed = this.forms.get('identification.companyInformation.companyListed').value;
        const isFloatableHigh = this.forms.get('identification.companyInformation.floatableShares').value >= 75;
        const isRegulated = this.forms.get('identification.companyInformation.activityRegulated').value;
        let changed = false;

        if (this.documentRules.isListed !== isListed) {
            this.documentRules.isListed = isListed;
            changed = true;
        }
        if (this.documentRules.isFloatableHigh !== isFloatableHigh) {
            this.documentRules.isFloatableHigh = isFloatableHigh;
            changed = true;
        }
        if (this.documentRules.isRegulated !== isRegulated) {
            this.documentRules.isRegulated = isRegulated;
            changed = true;
        }

        if (!changed) {
            return this.documentRules;
        }

        return {
            isListed: this.documentRules.isListed,
            isFloatableHigh: this.documentRules.isFloatableHigh,
            isRegulated: this.documentRules.isRegulated,
        };
    }

    get investorType() {
        let activityRegulated = this.forms.get('identification.companyInformation.activityRegulated').value;
        activityRegulated = !!Number(activityRegulated);

        const balanceSheetTotalValue = this.forms.get('identification.companyInformation.balanceSheetTotal').value;
        const netRevenuesNetIncomeValue = this.forms.get('identification.companyInformation.netRevenuesNetIncome').value;
        const shareholderEquityValue = this.forms.get('identification.companyInformation.shareholderEquity').value;

        if (activityRegulated) {
            return 'proByNature';
        }

        const balanceSheetCondition = balanceSheetTotalValue >= 20000000;
        const netRevenuesCondition = netRevenuesNetIncomeValue >= 40000000;
        const equityCondition = shareholderEquityValue >= 2000000;
        const trues = remove([balanceSheetCondition, netRevenuesCondition, equityCondition]);

        if (trues.length >= 2) {
            return 'proBySize';
        }

        return 'nonPro';
    }

    ngOnInit() {
        this.ngRedux.dispatch(clearMyKycRequestedPersist());

        this.initForm();
        this.initSubscriptions();
    }

    removeQueryParams() {
        const newUrl = this.router.createUrlTree([], {
            queryParams: {
                duplicate: null,
            },
            queryParamsHandling: 'merge',
        });
        this.location.replaceState(this.router.serializeUrl(newUrl));
    }

    initSubscriptions() {
        this.requests$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((amcs) => {
            this.newRequestService.getContext(amcs);
        })
        ;

        this.route.queryParamMap.subscribe((params) => {
            const step = params.get('step');
            const completed = params.get('completed');

            if (params.get('duplicate')) {
                this.duplicate = Number(params.get('duplicate'));
                this.removeQueryParams();
                this.getDuplicatedCompany();
            }

            this.fullForm = !(completed === 'true');

            this.initFormSteps(step);
        });
    }

    initForm() {
        this.forms = this.newRequestService.createRequestForm();
    }

    initFormSteps(completedStep) {
        this.currentCompletedStep = completedStep;
        let extraSteps = [];
        if (this.fullForm) {
            extraSteps = [
                {
                    title: this.translate.translate('Introduction'),
                    startHere: completedStep === 'amcSelection',
                },
                {
                    title: this.translate.translate('Identification'),
                    id: 'step-identification',
                    form: this.forms.get('identification'),
                    startHere: completedStep === 'introduction',
                },
                {
                    title: this.translate.translate('Risk profile'),
                    id: 'step-risk-profile',
                    form: this.forms.get('riskProfile'),
                    startHere: completedStep === 'identification',
                },
                {
                    title: this.translate.translate('Documents'),
                    id: 'step-documents',
                    form: this.forms.get('documents'),
                    startHere: completedStep === 'riskProfile',
                },
            ];
        }

        this.stepsConfig = [
            {
                title: this.translate.translate('Selection'),
                form: this.forms.get('selection'),
                id: 'step-selection',
            },
            ...extraSteps,
            {
                title: this.translate.translate('Validation'),
                id: 'step-validation',
                form: this.forms.get('validation'),
                startHere: this.fullForm ? completedStep === 'documents' : completedStep === 'amcSelection',
            },
        ];
    }

    getDuplicatedCompany() {
        combineLatest(this.myKycList$, this.managementCompanyList$)
        .pipe(
            rxMap(([kycs, managementCompanies]) => ([kycs, managementCompanies.toJS()])),
            rxFilter(([kycs, managementCompanies]) => managementCompanies.length),
            take(1),
        )
        .subscribe(([kycs, managementCompanies]) => {
            const kyc = find(kycs, ['kycID', this.duplicate]);
            const managementCompany = find(managementCompanies, ['companyID', kyc.amManagementCompanyID]);

            this.duplicateCompany = managementCompany.companyName;
        });
    }

    registered(isRegistered) {
        this.fullForm = !isRegistered;
        this.initFormSteps(this.currentCompletedStep);
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
