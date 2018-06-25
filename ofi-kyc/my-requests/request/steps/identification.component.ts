import {Component, OnInit, Input} from '@angular/core';
import {get as getValue} from 'lodash';

import {IdentificationService} from './identification.service';

@Component({
    selector: 'kyc-step-identification',
    templateUrl: './identification.component.html'
})
export class NewKycIdentificationComponent implements OnInit {

    @Input() form;

    constructor(
        private identificationService : IdentificationService
    ){}

    ngOnInit(){}

    get investorType(){
        let legalStatusControl = this.form.get('generalInformation.legalStatus').value;
        let legalStatusValue = getValue(legalStatusControl, [0, 'id']);
        let possibleLegalStatusValues = ['pensionOrMutualInsurance', 'bankingInstitution', 'insurer', 'listedCompany'];

        let keyFinancialValue = this.form.get('companyInformation.keyFinancialData').value;

        let balanceSheetTotalValue = this.form.get('companyInformation.balanceSheetTotal').value;

        let shareholderEquityValue = this.form.get('companyInformation.shareholderEquity').value;

        if(possibleLegalStatusValues.indexOf(legalStatusValue) !== -1){
            if(
                keyFinancialValue < 20000000 &&
                balanceSheetTotalValue < 40000000 &&
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

    handleSubmit(e){
        e.preventDefault();

        this.identificationService.sendRequest(this.form);
    }

}