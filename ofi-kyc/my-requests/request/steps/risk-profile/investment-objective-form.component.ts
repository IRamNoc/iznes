import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { select } from '@angular-redux/store';
import { NewRequestService, configDate } from '../../new-request.service';
import { RiskProfileService } from '../risk-profile.service';
import { get as getValue, find, pick, isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { filter as rxFilter, takeUntil, take } from 'rxjs/operators';
import { List } from 'immutable';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'investment-objective-form',
    templateUrl: './investment-objective-form.component.html',
    styleUrls: ['./investment-objective-form.component.scss']
})
export class InvestmentObjectiveFormComponent implements OnInit, OnDestroy {
    @Output() refreshForm = new EventEmitter<void>();
    @Input() form;
    @Input() multiple;
    @Input() index;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = true;
    configDate;

    investmentHorizonList;
    riskProfileList;
    riskAcceptanceList;
    performanceProfileList;
    clientNeeds;
    amc = {
        companyID: '',
        companyName: '',
    };

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
        public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        this.initFormCheck();
        this.initData();
        this.getCurrentFormData();
        this.configDate = configDate;
    }

    getCurrentFormData() {
        this.riskProfileService.currentServerData.riskobjective
            .pipe(
                rxFilter((data: any) => !isEmpty(data)),
                rxFilter((data: any) => {
                    let currentAMCId = this.form.get('assetManagementCompanyID').value;
                    let dataAMCId = data.assetManagementCompanyID;
                    return !this.multiple || (dataAMCId === currentAMCId);
                }),
                take(1)
            )
            .subscribe((data: any) => {
                data.riskAcceptance = pick(data, ['riskAcceptanceLevel1', 'riskAcceptanceLevel2', 'riskAcceptanceLevel3', 'riskAcceptanceLevel4']);
                this.form.patchValue(data);
            });
    }

    initData() {
        this.managementCompanyList$
            .pipe(
                rxFilter((managementCompanyList: List<any>) => managementCompanyList && managementCompanyList.size > 0),
                takeUntil(this.unsubscribe),
            )
            .subscribe(amcList => {
                const managementCompanyList = amcList.toJS();
                let amcID = this.form.get('assetManagementCompanyID').value;

                if (amcID) {
                    let found = find(managementCompanyList, ['companyID', amcID]);

                    if (found) {
                        this.amc = found;
                    }
                }
            });

        this.investmentHorizonList = this.newRequestService.investmentHorizonList;
        this.riskProfileList = this.newRequestService.riskProfileList;

        this.translate.translate(this.riskProfileList);

        this.riskAcceptanceList = this.newRequestService.riskAcceptanceList;
        this.performanceProfileList = this.newRequestService.performanceProfileList;
        this.clientNeeds = this.newRequestService.clientNeedsList;
    }

    initFormCheck() {
        this.form.get('performanceProfile').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(data => {
                this.formCheckPerformanceProfile(data);
            });

        this.form.get('riskProfile').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(value => {
                let riskProfileValue = getValue(value, [0, 'id']);

                this.formCheckRiskProfile(riskProfileValue);
            });

        this.form.get('investmentHorizonWanted.specific').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(value => {
                this.formCheckInvestmentHorizonWanted(value);
            });

        // Form persist patchvalue comes in too early so we have to manually recheck the values
        (this.form.get('performanceProfile') as FormControl).updateValueAndValidity();
        (this.form.get('riskProfile') as FormControl).updateValueAndValidity();
        (this.form.get('investmentHorizonWanted.specific') as FormControl).updateValueAndValidity();
    }

    formCheckInvestmentHorizonWanted(value) {
        let investmentHorizonWantedSpecificPeriodControl : FormControl = this.form.get('investmentHorizonWantedSpecificPeriod');

        if (value) {
            investmentHorizonWantedSpecificPeriodControl.enable();
        } else {
            investmentHorizonWantedSpecificPeriodControl.disable();
        }

        this.refreshForm.emit();
    }

    formCheckPerformanceProfile(data){
        let hasOther = data.others;
        let performanceProfileSpecificationControl = this.form.get('performanceProfileSpecification');

        if (hasOther) {
            performanceProfileSpecificationControl.enable();
        } else{
            performanceProfileSpecificationControl.disable();
        }
    }

    formCheckRiskProfile(value) {
        let riskProfileCapitalControl : FormControl = this.form.get('riskProfileCapital');

        if (value === 'partiallyProtected') {
            riskProfileCapitalControl.enable();
        } else {
            riskProfileCapitalControl.disable();
        }

        this.refreshForm.emit();
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
