import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {select} from '@angular-redux/store';
import {NewRequestService} from "../../new-request.service";
import {RiskProfileService} from '../risk-profile.service';
import {Subject} from 'rxjs/Subject';
import {find} from 'lodash';

@Component({
    selector : 'investment-constraint-form',
    templateUrl : './investment-constraint-form.component.html',
    styleUrls : ['./investment-constraint-form.component.scss']
})
export class InvestmentConstraintFormComponent implements OnInit, OnDestroy{

    @Input() form;
    @Input() multiple;
    @Input() index;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = true;
    amc = {
        companyID : '',
        companyName : ''
    };

    constructor(
        private newRequestService : NewRequestService,
        private riskProfileService : RiskProfileService
    ){
    }

    ngOnInit(){
        this.initData();
        this.initFormCheck();
        this.getCurrentFormData();
    }

    getCurrentFormData(){
        this.riskProfileService.currentServerData.riskobjective.subscribe((data : any) => {
            let currentAMCId = this.form.get('assetManagementCompanyID').value;
            let dataAMCId = data.assetManagementCompanyID;

            if(!this.multiple || (dataAMCId === currentAMCId) ){
                this.form.patchValue(data);
            }
        });
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
    }

    initFormCheck(){
        this.form.get('investmentDecisionsAdHocCommittee').valueChanges.subscribe(value => {
            this.formCheckInvestmentDecisionsAdHocCommittee(value);
        });
    }

    formCheckInvestmentDecisionsAdHocCommittee(value){
        let control = this.form.get('investmentDecisionsAdHocCommitteeSpecification');
        if(value === 'yes'){
            control.enable();
        } else{
            control.disable();
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