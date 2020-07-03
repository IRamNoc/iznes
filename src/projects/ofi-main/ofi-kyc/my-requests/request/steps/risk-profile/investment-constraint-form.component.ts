import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, take } from 'rxjs/operators';
import { find, isEmpty } from 'lodash';
import { List } from 'immutable';
import { NewRequestService } from '../../new-request.service';
import { RiskProfileService } from '../risk-profile.service';

@Component({
    selector: 'investment-constraint-form',
    templateUrl: './investment-constraint-form.component.html',
    styleUrls: ['./investment-constraint-form.component.scss'],
})
export class InvestmentConstraintFormComponent implements OnInit, OnDestroy {
    @Output() refreshForm = new EventEmitter<void>();
    @Input() form;
    @Input() multiple;
    // Index of this investment nature form. the risk nature('investment detail') section can contain multiple investment nature forms, when a kyc is against multiple AMs
    @Input('index') formIndex;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['ofi', 'ofiKyc', 'myInformations', 'investorType']) kycInvestorType$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = true;
    amc = {
        companyID: '',
        companyName: '',
    };
    kycInvestorType;

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
    ) {
    }

    ngOnInit() {
        this.initData();
        this.initFormCheck();
        this.getCurrentFormData();
    }

    getCurrentFormData() {
        this.riskProfileService.currentServerData.riskobjective
            .pipe(
                rxFilter((data: any) => !isEmpty(data)),
                rxFilter((data: any) => {
                    const currentAMCId = this.form.get('assetManagementCompanyID').value;
                    const dataAMCId = data.assetManagementCompanyID;

                    return !this.multiple || (dataAMCId === currentAMCId);
                }),
            )
            .subscribe((data: any) => {
                this.form.patchValue(data);
            });
    }

    initData() {
        this.managementCompanyList$
            .pipe(
                rxFilter((amcList: List<any>) => amcList && amcList.size > 0),
                takeUntil(this.unsubscribe),
            )
            .subscribe((amcList) => {
                const managementCompanyList = amcList.toJS();
                const amcID = this.form.get('assetManagementCompanyID').value;

                if (amcID) {
                    const found = find(managementCompanyList, ['companyID', amcID]);

                    if (found) {
                        this.amc = found;
                    }
                }
            });

        this.kycInvestorType$.pipe(
            takeUntil(this.unsubscribe),
        ).subscribe((t) => {
            if (!t) return;
            this.kycInvestorType = t;
        });
    }

    initFormCheck() {
        this.form.get('investmentDecisionsAdHocCommittee').valueChanges.subscribe((value) => {
            this.formCheckInvestmentDecisionsAdHocCommittee(value);
        });
    }

    formCheckInvestmentDecisionsAdHocCommittee(value) {
        const control = this.form.get('investmentDecisionsAdHocCommitteeSpecification');

        if (value === 'yes') {
            control.enable();
        } else {
            control.disable();
        }

        this.refreshForm.emit();
    }

    isNowCP() {
        return this.kycInvestorType === 70 || this.kycInvestorType === 80;
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        const control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
