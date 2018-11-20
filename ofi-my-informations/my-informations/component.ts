/* Core/Angular imports. */
import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import * as _ from 'lodash';
import { KycMyInformations } from '../../ofi-store/ofi-kyc/my-informations';

// Services
import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { fromJS } from 'immutable';

import { MultilingualService } from '@setl/multilingual';

export enum ViewMode {
    PAGE = 'PAGE',
    POPUP = 'POPUP',
}

@Component({
    selector: 'app-my-informations',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})

export class OfiMyInformationsComponent implements OnInit, OnDestroy {
    // Locale
    language = 'fr-Latn';

    @Input() viewMode: ViewMode;
    @Input() type: number;
    @Output() onClose = new EventEmitter<void>();
    @Output() onSubmit = new EventEmitter<KycMyInformations>();

    additionnalForm: FormGroup;

    private subscriptions = [];

    phoneNumbersCountryCodes = [];

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb;

    public managementCompanyList;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ngRedux: NgRedux<any>,
        private _fb: FormBuilder,
        public translate: MultilingualService,
        @Inject('phoneCodeList') phoneCodeList,
    ) {
        this.phoneNumbersCountryCodes = phoneCodeList;

        this.additionnalForm = this._fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(((\([A-z0-9]+\))?[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ]),
            ],
            firstName: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            lastName: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            invitedBy: [
                { value: '', disabled: true },
                Validators.compose([
                    Validators.required,
                ]),
            ],
            companyName: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            phoneCode: [
                '',
                Validators.compose([
                    Validators.required,
                ]),
            ],
            phoneNumber: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^\d+$/),
                ]),
            ],
        });

        // language
        this.subscriptions.push(this.requestLanguageObj.subscribe(requested => this.getLanguage(requested)));
        this.subscriptions.push(this.managementCompanyAccessListOb
            .subscribe(managementCompanyList => this.getManagementCompanyListFromRedux(managementCompanyList))
        );
    }

    ngOnInit() {
    }

    @Input() set userInfo(userInfo) {
        if (!this.additionnalForm.controls.phoneCode.value) {
            this.switchPhoneCode();
        }
        this.additionnalForm.controls['email'].setValue(userInfo.email);
        this.additionnalForm.controls['firstName'].setValue(userInfo.firstName);
        this.additionnalForm.controls['lastName'].setValue(userInfo.lastName);
        this.additionnalForm.controls['invitedBy'].setValue(userInfo.amCompanyName);
        this.additionnalForm.controls['phoneCode'].setValue(this.getPhoneCode(userInfo.phoneCode));
        this.additionnalForm.controls['phoneNumber'].setValue(userInfo.phoneNumber);

        // needs to be asset management company name, this handles investor
        // if (this.type === 46) {
        this.additionnalForm.controls['companyName'].setValue(userInfo.companyName);
        // }
    }

    isPopUpMode() {
        return this.viewMode === ViewMode.POPUP;
    }

    getPhoneCode(code: string) {
        if (!code) {
            return '';
        }
        return [_.find(this.phoneNumbersCountryCodes, { id: code })] || '';
    }

    switchPhoneCode() {
        if (this.additionnalForm && this.additionnalForm.controls) {
            switch (this.language) {
            case 'fr-Latn':
                this.additionnalForm.controls['phoneCode'].patchValue([{ id: '+33', text: 'France (+33)' }]);
                break;
            case 'en-Latn':
                this.additionnalForm.controls['phoneCode']
                .patchValue([{ id: '+44', text: 'United Kingdom (+44)' }]);
                break;
            default:
                this.additionnalForm.controls['phoneCode'].patchValue([{ id: '+33', text: 'France (+33)' }]);
                break;
            }
        }
    }

    getLanguage(requested): void {
        if (requested) {
            this.language = requested;
            this.switchPhoneCode();
        }
    }

    onClickCloseButton() {
        this.onClose.emit();
    }

    onSubmitClick() {
        const userInformations = {
            ...this.additionnalForm.value,
            phoneCode: _.get(this.additionnalForm.value, ['phoneCode', '0', 'id'], ''),
        };
        this.onSubmit.emit(userInformations);
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }

    getManagementCompanyListFromRedux(managementCompanyList) {

        // if investor no need to run the code
        if (this.type === 46) {
            return;
        }

        // if no mangement company no need to run this code
        if (Object.keys(managementCompanyList).length === 0) {
            return;
        }

        const managementCompanyListImu = fromJS(managementCompanyList);
        this.managementCompanyList = managementCompanyListImu.reduce(
            (result, item) => {
                result.push({
                    companyName: item.get('companyName', ''),
                });
                return result;
            },
            [],
        );

        // get am company name
        const assetManagerValue = this.managementCompanyList && this.managementCompanyList[0].companyName;
        this.additionnalForm.controls['companyName'].setValue(assetManagerValue);
        this.additionnalForm.controls['companyName'].disable();

        this._changeDetectorRef.markForCheck();
    }
}
