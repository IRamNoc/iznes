import {Component, OnInit, Input} from '@angular/core';
import {get as getValue} from 'lodash';
import {select} from '@angular-redux/store';
import {PersistService} from '@setl/core-persist';

import {NewRequestService} from '../new-request.service';
import {IdentificationService} from './identification.service';

@Component({
    selector: 'kyc-step-identification',
    templateUrl: './identification.component.html'
})
export class NewKycIdentificationComponent implements OnInit {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    kycs;

    constructor(
        private newRequestService : NewRequestService,
        private identificationService : IdentificationService,
        private persistService : PersistService,
    ){}

    ngOnInit(){
        this.persistForm();
    }

    get investorType(){
        let legalStatusControl = this.form.get('generalInformation.legalStatus').value;
        let legalStatusValue = getValue(legalStatusControl, [0, 'id']);
        let possibleLegalStatusValues = ['pensionOrMutualInsurance', 'bankingInstitution', 'insurer', 'listedCompany'];

        let balanceSheetTotalValue = this.form.get('companyInformation.balanceSheetTotal').value;
        let netRevenuesNetIncomeValue = this.form.get('companyInformation.netRevenuesNetIncome').value;
        let shareholderEquityValue = this.form.get('companyInformation.shareholderEquity').value;

        if(possibleLegalStatusValues.indexOf(legalStatusValue) !== -1){
            if(
                balanceSheetTotalValue < 20000000 &&
                netRevenuesNetIncomeValue < 40000000 &&
                shareholderEquityValue < 2000000
            ){
                return "proByNature";
            } else{
                return "proBySize";
            }
        } else{
            return "nonPro";
        }
    }

    persistForm(){
        this.persistService.watchForm(
            'newkycrequest/identification',
            this.form
        );
    }

    clearPersistForm(){
        this.persistService.refreshState(
            'newkycrequest/identification',
            this.newRequestService.createIdentificationFormGroup()
        )
    }

    handleSubmit(e){
        e.preventDefault();

        if(!this.form.valid){
            return;
        }

        this.requests$.take(1).subscribe(requests => {
            this.identificationService.sendRequest(this.form, requests).then(() => {
                this.clearPersistForm();
            });
        });
    }

}