import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { OfiMandateInvestorService } from '../../ofi-req-services/ofi-mandate-investor/service';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { get } from 'lodash';
import { InvestorType, buildInvestorTypeList } from '../../shared/investor-types';
import { Observable, of } from 'rxjs';

const companyNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value.investorType[0].id === InvestorType.Institutional && !control.value.companyName) {
        control.get('companyName').setErrors({ companyName: true });
        return { companyName: true }
    }
    return null;
}

interface ListItem {
    id: number;
    text: string;
}

@AppObservableHandler
@Component({
    selector: 'app-invite-mandate-investors',
    templateUrl: 'component.html',
    styleUrls: ['component.scss'],
})
export class OfiInviteMandateInvestorsComponent implements OnInit {

    inviteForm: FormGroup;
    investorTypes = buildInvestorTypeList(InvestorType.Institutional, InvestorType.Retail);
    investorTypes$: Observable<ListItem[]>;

    get f() {
        return (<FormArray>this.inviteForm.controls.investors).controls;
    }

    @select(['user', 'siteSettings', 'language']) language$: Observable<string>;

    constructor(
        private fb: FormBuilder,
        private service: OfiMandateInvestorService,
        private location: Location,
        private toaster: ToasterService,
        private language: MultilingualService,
        ) { }

    ngOnInit() {
        this.inviteForm = this.fb.group({ investors: this.fb.array([]) });
        this.investorTypes$ = this.language$.flatMap(() => of(this.language.translate(this.investorTypes)));
        this.addInvestor();
    }

    async commitInvestors() {
        if (!this.inviteForm.valid) return;

        (await Promise.all(this.f.map((investorForm) => {
            const { firstName, lastName, reference, companyName, investorType } = investorForm.value;

            return this.service.createInvestor(investorType[0].id, firstName, lastName, reference, companyName);
        }))).forEach((result) => {
            const { Status, firstName, lastName } = result[1].Data;
            const msg =  (Status === 'OK') ? ['success', 'Successfully created'] : ['error', 'Failed to create'];

            return this.toaster.pop(msg[0], this.msg(msg[1], firstName, lastName));
        });

        this.location.back();
    }

    addInvestor() {
        (<FormArray>this.inviteForm.controls.investors).push(
            this.fb.group({
                investorType: [[this.investorTypes[0]], Validators.required],
                companyName: [''],
                firstName: ['', Validators.required],
                lastName: ['', Validators.required],
                reference: '',
            }, { validator: companyNameValidator })
        )
    }

    isRetailInvestor(investorType: FormControl): boolean {
        const userType = get(investorType.value, '0.id', 0);
        if (userType === InvestorType.Retail) {
            investorType.setErrors({ investorType: true });
            return true;
        }

        return false;
    }

    goBack() {
        this.location.back();
    }

    msg(message, firstName, lastName) {
        return this.language.translate( `${message} @firstName@ @lastName@`, { firstName, lastName } );
    }
}
