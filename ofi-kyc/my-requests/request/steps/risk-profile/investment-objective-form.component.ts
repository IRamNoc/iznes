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
    styleUrls: ['./investment-objective-form.component.scss'],
})
export class InvestmentObjectiveFormComponent implements OnInit, OnDestroy {
    @Output() refreshForm = new EventEmitter<void>();
    @Input() form;
    @Input() multiple;
    @Input() index;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = true;
    configDate;

    investmentHorizonList;
    riskProfileList;
    riskAcceptanceList;
    performanceProfileList;
    clientNeedsList;
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
        this.initLists();
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
                take(1),
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

        this.requestLanguageObj
        .pipe(takeUntil(this.unsubscribe))
        .subscribe(() => this.initLists());
    }

    initFormCheck() {
        this.form.get('performanceProfile').valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((data) => {
                this.formCheckPerformanceProfile(data);
            });

        this.form.get('riskProfile').valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((value) => {
                const riskProfileValue = getValue(value, [0, 'id']);

                this.formCheckRiskProfile(riskProfileValue);
            });

        this.form.get('investmentHorizonWanted.specific').valueChanges
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe((value) => {
                this.formCheckInvestmentHorizonWanted(value);
            });

        // Form persist patchvalue comes in too early so we have to manually recheck the values
        (this.form.get('performanceProfile') as FormControl).updateValueAndValidity();
        (this.form.get('riskProfile') as FormControl).updateValueAndValidity();
        (this.form.get('investmentHorizonWanted.specific') as FormControl).updateValueAndValidity();
    }

    initLists() {
        // Do not attempt translation of riskAcceptanceList in its current format
        this.riskAcceptanceList = this.newRequestService.riskAcceptanceList;

        this.investmentHorizonList = this.translate.translate(this.newRequestService.investmentHorizonList);
        this.riskProfileList = this.translate.translate(this.newRequestService.riskProfileList);
        this.performanceProfileList = this.translate.translate(this.newRequestService.performanceProfileList);
        this.clientNeedsList = this.translate.translate(this.newRequestService.clientNeedsList);
    }

    formCheckInvestmentHorizonWanted(value) {
        const investmentHorizonWantedSpecificPeriodControl : FormControl = this.form.get('investmentHorizonWantedSpecificPeriod');

        if (value) {
            investmentHorizonWantedSpecificPeriodControl.enable();
        } else {
            investmentHorizonWantedSpecificPeriodControl.disable();
        }

        this.refreshForm.emit();
    }

    formCheckPerformanceProfile(data) {
        const hasOther = data.others;
        const performanceProfileSpecificationControl = this.form.get('performanceProfileSpecification');

        if (hasOther) {
            performanceProfileSpecificationControl.enable();
        } else {
            performanceProfileSpecificationControl.disable();
        }
    }

    formCheckRiskProfile(value) {
        const riskProfileCapitalControl : FormControl = this.form.get('riskProfileCapital');

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
        const control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
