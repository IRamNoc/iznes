import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {get as getValue} from 'lodash';
import {select} from '@angular-redux/store';
import {PersistService} from '@setl/core-persist';

import {NewRequestService} from '../new-request.service';
import {IdentificationService} from './identification.service';

@Component({
    selector: 'kyc-step-identification',
    templateUrl: './identification.component.html'
})
export class NewKycIdentificationComponent implements OnInit, AfterViewInit {

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
            'newkyc/identification',
            this.form
        );
    }

    clearPersistForm(){
        this.persistService.refreshState(
            'newkyc/identification',
            this.newRequestService.createIdentificationFormGroup()
        )
    }

    handleSubmit(e){
        e.preventDefault();

        this.requests$.take(1).subscribe(requests => {
            this.identificationService.sendRequest(this.form, requests).then(() => {
                this.clearPersistForm();
            });
        });
    }

    ngAfterViewInit(){
        this.form.get('generalInformation').patchValue({
            registeredCompanyName : 'name',
            legalForm : [{id : 'CreditUnion', text : 'Credit Union'}],
            leiCode : '12345678901234567890',
            registeredCompanyAddressLine1 : 'add1',
            registeredCompanyZipCode : '1245',
            registeredCompanyCity : 'city',
            registeredCompanyCountry : [{id : 'FR', text : 'France'}],
            countryTaxResidence : [{id : 'FR', text : 'France'}],
            sectorActivity : [{id : 'Cosmetics', text : 'Cosmetics'}],
            legalStatus : [{id : 'insurer', text : 'Insurer'}]
        });
        this.form.get('companyInformation').patchValue({
            activities : [{id : 'ownAccount', text : 'Own account'}],
            ownAccountinvestor : [{id : 'Cleaning', text : 'Cleaning'}],
            geographicalAreaOfActivity : [{id : 'oecd', text : 'OECD'}],
            geographicalAreaOfActivitySpecification : 'Somewhere',
            balanceSheetTotal : '2000',
            netRevenuesNetIncome : '2000',
            shareholderEquity : '2000',
            capitalNature : {
                treasury : true
            },
            geographicalOrigin1 : [{'id' : 'country', text : 'Country'}],
            geographicalOrigin2 : [{id : 'FR', text : 'France'}],

            beneficiaries : [{
                firstName : 'name',
                lastName : 'other name',
                address : '1dd1',
                nationality : [{id : 'FR', text : 'France'}],
                dateOfBirth : '2001-01-01',
                cityOfBirth : 'pouetville',
                countryOfBirth : [{id : 'FR', text : 'France'}],
                document : '15465456046540560',
                holdingPercentage : '100',
            }],
            totalFinancialAssetsAlreadyInvested : [{'id' : 'Beyond', text : 'Beyond'}]
        });
        this.form.get('bankingInformation').patchValue({
            custodianHolderAccount : [{id : 'Barclays', text : 'Barclays'}]
        });
        this.form.get('classificationInformation').patchValue({
            pro : {
                excludeProducts: 'nan'
            }
        });
    }
}