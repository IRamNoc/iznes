import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {select} from '@angular-redux/store';
import {NewRequestService, configDate} from "../../new-request.service";
import {get as getValue, find} from 'lodash';
import {Subject} from 'rxjs/Subject';

@Component({
    selector : 'investment-objective-form',
    templateUrl : './investment-objective-form.component.html',
    styleUrls : ['./investment-objective-form.component.scss']
})
export class InvestmentObjectiveFormComponent implements OnInit, OnDestroy{

    @Input() form;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    unsubscribe : Subject<any> = new Subject();
    open: boolean = true;
    configDate;

    investmentHorizonList;
    riskProfileList;
    riskAcceptanceList;
    performanceProfileList;
    clientNeeds;
    amc = {
        companyID : '',
        companyName : ''
    };

    constructor(
        private newRequestService : NewRequestService
    ){
    }

    ngOnInit(){
        this.initFormCheck();
        this.initData();
        this.configDate = configDate;
    }

    initData(){
        this.managementCompanyList$.takeUntil(this.unsubscribe).subscribe(amcList => {
            let amcID = this.form.get('assetManagementCompanyID').value;

            if(amcID){
                let found = find(amcList, ['companyID', amcID]);

                if(found){
                    this.amc = found;
                }
            }
        });

        this.investmentHorizonList = this.newRequestService.investmentHorizonList;
        this.riskProfileList = this.newRequestService.riskProfileList;
        this.riskAcceptanceList = this.newRequestService.riskAcceptanceList;
        this.performanceProfileList = this.newRequestService.performanceProfileList;
        this.clientNeeds = this.newRequestService.clientNeedsList;
    }

    initFormCheck(){
        this.form.get('riskProfile').valueChanges.takeUntil(this.unsubscribe).subscribe(value => {
            let riskProfileValue = getValue(value, [0, 'id']);

            this.formCheckRiskProfile(riskProfileValue);
        });

        this.form.get('investmentHorizonWanted.specific').valueChanges.takeUntil(this.unsubscribe).subscribe(value => {
            this.formCheckInvestmentHorizonWanted(value);
        });
    }

    formCheckInvestmentHorizonWanted(value){
        let investmentHorizonWantedSpecificPeriodControl = this.form.get('investmentHorizonWantedSpecificPeriod');

        if(value){
            investmentHorizonWantedSpecificPeriodControl.enable();
        } else{
            investmentHorizonWantedSpecificPeriodControl.disable();
        }
    }

    formCheckRiskProfile(value){
        let riskProfileCapitalControl = this.form.get('riskProfileCapital');

        if(value === 'partiallyProtected'){
            riskProfileCapitalControl.enable();
        } else{
            riskProfileCapitalControl.disable();
        }
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}