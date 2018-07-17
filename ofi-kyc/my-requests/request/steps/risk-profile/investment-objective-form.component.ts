import {Component, Input, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {select} from '@angular-redux/store';
import {NewRequestService, configDate} from "../../new-request.service";
import {RiskProfileService} from '../risk-profile.service';
import {get as getValue, find, pick} from 'lodash';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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
        companyName: ''
    };

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService
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
                takeUntil(this.unsubscribe)
            )
            .subscribe((data: any) => {
                let currentAMCId = this.form.get('assetManagementCompanyID').value;
                let dataAMCId = data.assetManagementCompanyID;
                if (!this.multiple || (dataAMCId === currentAMCId)) {
                    data.riskAcceptance = pick(data, ['riskAcceptanceLevel1', 'riskAcceptanceLevel2', 'riskAcceptanceLevel3', 'riskAcceptanceLevel4']);
                    this.form.patchValue(data);
                }
            })
        ;
    }

    initData() {
        this.managementCompanyList$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(amcList => {
                let amcID = this.form.get('assetManagementCompanyID').value;

                if (amcID) {
                    let found = find(amcList, ['companyID', amcID]);

                    if (found) {
                        this.amc = found;
                    }
                }
            })
        ;

        this.investmentHorizonList = this.newRequestService.investmentHorizonList;
        this.riskProfileList = this.newRequestService.riskProfileList;
        this.riskAcceptanceList = this.newRequestService.riskAcceptanceList;
        this.performanceProfileList = this.newRequestService.performanceProfileList;
        this.clientNeeds = this.newRequestService.clientNeedsList;
    }

    initFormCheck() {
        this.form.get('riskProfile').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(value => {
                let riskProfileValue = getValue(value, [0, 'id']);

                this.formCheckRiskProfile(riskProfileValue);
            })
        ;

        this.form.get('investmentHorizonWanted.specific').valueChanges
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(value => {
                this.formCheckInvestmentHorizonWanted(value);
            })
        ;
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