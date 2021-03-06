import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { OfiMandateInvestorService } from '../../ofi-req-services/ofi-mandate-investor/service';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { get } from 'lodash';
import { InvestorType, buildInvestorTypeList, isInstitutional } from '../../shared/investor-types';
import { Observable, of } from 'rxjs';

const companyNameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value.investorType[0].id === InvestorType.InstitutionalMandate && !control.value.companyName) {
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

const nameValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    if (control.value.investorType[0].id === InvestorType.RetailMandate) {
        if (!control.value.firstName) {
            control.get('firstName').setErrors({ required: true });
            return { firstName: true }
        }
        if (!control.value.lastName) {
            control.get('lastName').setErrors({ required: true });
            return { lastName: true }
        }
    }
    control.get('firstName').setErrors(null);
    control.get('lastName').setErrors(null);
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
    investorTypes = buildInvestorTypeList(InvestorType.InstitutionalMandate, InvestorType.RetailMandate);
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
                    err[1].Data = { ...err[1].Data, firstName, lastName, companyName, investorType };
                    return err;
                }
            }
        }))).forEach((result) => {
            const { Status, firstName, lastName, companyName, investorType } = result[1].Data;
            const msg =  (Status === 'OK') ? ['success', 'Successfully created'] : ['error', 'Failed to create'];

            return this.toaster.pop(msg[0], this.msg(msg[1], firstName, lastName, companyName, investorType));
        });

        this.location.back();
    }

    /**
     * Get name bsased on investorType
     *
     * @param {string} firstName
     * @param {string} lastName
     * @param {string} companyName
     * @param {InvestorType} investorType
     *
     * @returns string
     */
    getName(firstName: string, lastName: string, companyName: string, investorType: InvestorType): string {
        return isInstitutional(investorType) ? companyName : `${firstName} ${lastName}`;
    }

    addInvestor() {
        (<FormArray>this.inviteForm.controls.investors).push(
            this.fb.group({
                investorType: [[this.investorTypes[0]], Validators.required],
                companyName: [''],
                firstName: ['', Validators.maxLength(100)],
                lastName: ['', Validators.maxLength(100)],
                reference: ['', Validators.maxLength(100)],
            }, { validator: Validators.compose([companyNameValidator, nameValidator]) })
        )
    }

    isRetailInvestor(investorType: FormControl): boolean {
        const userType = get(investorType.value, '0.id', 0);

        return userType === InvestorType.RetailMandate;
    }

    goBack() {
        this.location.back();
    }

    msg(message, firstName, lastName, companyName, investorType) {
        return this.language.translate(
            `${message} @name@`,
            { name: this.getName(firstName, lastName, companyName, investorType) }
        );
    }

    removeInvestor(i: number) {
        const control = <FormArray>this.inviteForm.controls['investors'];
        control.removeAt(i);
    }
}
