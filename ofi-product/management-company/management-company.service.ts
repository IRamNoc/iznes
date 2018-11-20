import * as _ from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { FileService } from '@setl/core-req-services';
import { SagaHelper } from '@setl/utils';

@Injectable({
    providedIn: 'root',
})
export class ManagagementCompanyService {

    validators: {
        [validatorName: string]: ValidatorFn;
    };

    constructor(
        private fb: FormBuilder,
        private redux: NgRedux<any>,
        private fileService: FileService,
        @Inject('product-config') productConfig,
    ) {
        this.validators = productConfig.validators;
    }

    generateForm(): FormGroup {
        return this.fb.group({
            companyID: [
                '',
            ],
            companyName: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            emailAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            legalFormName: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            postalAddressLine1: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            postalAddressLine2: [
                '',
            ],
            postalCode: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            city: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            country: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            taxResidence: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            supervisoryAuthority: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            rcsMatriculation: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            numSiretOrSiren: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            shareCapital: [
                '',
                Validators.compose([
                    Validators.required,
                    this.isNumericInput,
                ]),
            ],
            lei: [
                '',
                Validators.compose([
                    Validators.required,
                    this.validators.lei,
                ]),
            ],
            bic: [
                '',
                Validators.required,
            ],
            giinCode: [
                '',
                (control: AbstractControl): { [key: string]: any } | null => {
                    if (!control.value) {
                        return null;
                    }
                    return this.validators.giin(control);
                },
            ],
            commercialContact: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            operationalContact: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            directorContact: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            websiteUrl: [
                '',
                Validators.required,
            ],
            phoneNumberPrefix: [
                '',
                Validators.required,
            ],
            phoneNumber: [
                '',
                Validators.required,
            ],
            signature: [
                '',
            ],
            logo: [
                '',
            ],
        });
    }

    isNumericInput(control: FormControl) {
        if (control && control.value) {
            if (isNaN(control.value)) {
                return { invalid: true };
            }
        }
        return null;
    }
}
