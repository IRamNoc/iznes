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
        control.get('companyName').setErrors({ required: true });
        return { companyName: true }
    }
    if (control.value.companyName.length > 100) {
        control.get('companyName').setErrors({ maxlength: true });
        return { companyName: true }
    }
    control.get('companyName').setErrors(null);
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

        (await Promise.all(this.f.map(async (investorForm) => {
            const { firstName, lastName, reference, companyName, investorType } = investorForm.value;

            try {
                return await this.service.createInvestor(investorType[0].id, firstName, lastName, reference, companyName);
            } catch (err) {
                if (get(err, '1.Status') === 'Fail') {
                    err[1].Data = { ...err[1].Data, firstName, lastName };
                    return err;
                }
            }
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
                firstName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                lastName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
                reference: ['', Validators.maxLength(100)],
            }, { validator: companyNameValidator })
        )
    }

    isRetailInvestor(investorType: FormControl): boolean {
        const userType = get(investorType.value, '0.id', 0);
        if (userType === InvestorType.Retail) {
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

    removeInvestor(i: number) {
        const control = <FormArray>this.inviteForm.controls['investors'];
        control.removeAt(i);
    }
}
