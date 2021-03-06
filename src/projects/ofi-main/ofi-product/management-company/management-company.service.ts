import * as _ from 'lodash';
import { Injectable, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { FileService } from '@setl/core-req-services';
import { SagaHelper } from '@setl/utils';
import { CustomValidators } from '@setl/utils/helper';

@Injectable({
    providedIn: 'root',
})
export class ManagagementCompanyService {

    validators: {
        [validatorName: string]: ValidatorFn;
    };

    constructor(
        private fb: FormBuilder,
        @Inject('product-config') productConfig,
    ) {
        this.validators = productConfig.validators;
    }

    generateAddIpAddressForm(): FormGroup {
        return this.fb.group({
            ipAddress: new FormControl('', [
                Validators.required,
                Validators.pattern('(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)'),
            ]),
            description: [
                '',
                Validators.required,
            ]
        });
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
                [Validators.required, CustomValidators.bicValidator],
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
            externalEmail: [
                '',
            ],
            emailValidation: [
                '',
            ],
            mt502Email: [
                '',
            ],
            subManagementCompany0: [
                '',
            ],
            subManagementCompany1: [
                '',
            ],
            subManagementCompany2: [
                '',
            ],
            subManagementCompany3: [
                '',
            ],
            managementCompanyType: [[{id: 'common', 'text': 'Common'}]]
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
