/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { FileDropComponent } from '@setl/core-filedrop';
import { FormGroup, FormArray, FormControl, FormBuilder, Validators } from '@angular/forms';
import { FileService } from '@setl/core-req-services';
import { ManagementCompanyInterface } from './management-company.interface';
import { ManagementCompanyModel } from './management-company.model';
import { SagaHelper, Common, LogService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { fromJS } from 'immutable';
import * as _ from 'lodash';

// Internal
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';

// Services
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';

@Component({
    selector: 'management-company',
    styleUrls: ['./management-company.component.scss'],
    templateUrl: './management-company.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiManagementCompanyComponent implements OnInit, OnDestroy {

    language = 'en';

    managementCompanyForm: FormGroup;
    modelForm: any;
    editForm = false;
    showSearchTab = false;
    showModal = false;
    modalTitle = '';
    modalText = '';

    showConfirmModal = false;
    companyToDelete: any;

    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language
    };

    mcCountryOptions = ['France', 'Luxembourg'];

    managementCompanyList = [];

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // production or not
    production: boolean;

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb;
    @select(['user', 'siteSettings', 'production']) productionOb;

    constructor(
        private _fb: FormBuilder,
        private ngRedux: NgRedux<any>,
        private mcService: OfiManagementCompanyService,
        private _changeDetectorRef: ChangeDetectorRef,
        private fileService: FileService,
        private logService: LogService,
        private alertsService: AlertsService,
    ) {
        this.mcService.getManagementCompanyList();

        this.subscriptionsArray.push(this.requestLanguageObj.subscribe((requested) => this.getLanguage(requested)));
        this.subscriptionsArray.push(this.managementCompanyAccessListOb.subscribe((managementCompanyList) => this.getManagementCompanyListFromRedux(managementCompanyList)));
        this.subscriptionsArray.push(this.productionOb.subscribe(production => this.production = production));
    }

    ngOnInit() {
        this.managementCompanyForm = this._fb.group({
            companyID: [
                '',
            ],
            mc_name: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_emailAddress: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_country_select: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_addressPrefix: [
                ''
            ],
            mc_address1: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_address2: [
                ''
            ],
            mc_address3: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_address4: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_postalCode: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_tax_residence: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_registration_number: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_supervisory_authority: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_siret_siren: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_creation_date: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])/) // YYYY-MM-DD
                ])
            ],
            mc_share_capital: [
                '',
                Validators.compose([
                    Validators.required,
                    this.isNumericInput
                ])
            ],
            mc_commercial_contact: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_operational_contact: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_director_contact: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mc_lei: [
                ''
            ],
            mc_bic: [
                ''
            ],
            mc_giin: [
                ''
            ],
            mc_logo_name: [
                '',
                // Validators.compose([
                //     Validators.required,
                // ])
            ],
            mc_logo: [
                '',
                // Validators.compose([
                //     Validators.required,
                // ])
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

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    getLanguage(requested): void {
        this.logService.log('Language changed from ' + this.language + ' to ' + requested);
        if (requested) {
            switch (requested) {
            case 'fra':
                this.language = 'fr';
                break;
            case 'eng':
                this.language = 'en';
                break;
            default:
                this.language = 'en';
                break;
            }
        }
    }

    confirmModal(response): void {
        this.showConfirmModal = false;
        if (response === 1) {
            this.deleteCompany(this.companyToDelete);
        }
    }

    getManagementCompanyListFromRedux(managementCompanyList) {
        const managementCompanyListImu = fromJS(managementCompanyList);

        this.managementCompanyList = managementCompanyListImu.reduce((result, item) => {

            result.push({
                companyID: item.get('companyID', 0),
                companyName: item.get('companyName', ''),
                emailAddress: item.get('emailAddress', ''),
                country: item.get('country', ''),
                addressPrefix: item.get('addressPrefix', ''),
                postalAddressLine1: item.get('postalAddressLine1', ''),
                postalAddressLine2: item.get('postalAddressLine2', ''),
                city: item.get('city', ''),
                stateArea: item.get('stateArea', ''),
                postalCode: item.get('postalCode', ''),
                taxResidence: item.get('taxResidence', ''),
                registrationNum: item.get('registrationNum', ''),
                supervisoryAuthority: item.get('supervisoryAuthority', ''),
                numSiretOrSiren: item.get('numSiretOrSiren', ''),
                creationDate: item.get('creationDate', ''),
                shareCapital: item.get('shareCapital', 0),
                commercialContact: item.get('commercialContact', ''),
                operationalContact: item.get('operationalContact', ''),
                directorContact: item.get('directorContact', ''),
                lei: item.get('lei', ''),
                bic: item.get('bic', ''),
                giinCode: item.get('giinCode', ''),
                logoName: item.get('logoName', ''),
                logoURL: item.get('logoURL', '')
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    editCompany(company: object) {
        this.modelForm = new ManagementCompanyModel();
        // this.logService.log('editCompany', company);
        for (const result in company) {
            switch (result) {
            case 'companyID':
                this.modelForm.companyID = company[result];
                break;
            case 'companyName':
                this.modelForm.mc_name = company[result];
                break;
            case 'emailAddress':
                this.modelForm.mc_emailAddress = company[result];
                break;
            case 'country':
                this.modelForm.mc_country_select = company[result];
                this.managementCompanyForm.controls['mc_country_select'].setValue([company[result]]);
                break;
            case 'addressPrefix':
                this.modelForm.mc_addressPrefix = company[result];
                break;
            case 'postalAddressLine1':
                this.modelForm.mc_address1 = company[result];
                break;
            case 'postalAddressLine2':
                this.modelForm.mc_address2 = company[result];
                break;
            case 'city':
                this.modelForm.mc_address3 = company[result];
                break;
            case 'stateArea':
                this.modelForm.mc_address4 = company[result];
                break;
            case 'postalCode':
                this.modelForm.mc_postalCode = company[result];
                break;
            case 'taxResidence':
                this.modelForm.mc_tax_residence = company[result];
                break;
            case 'registrationNum':
                this.modelForm.mc_registration_number = company[result];
                break;
            case 'supervisoryAuthority':
                this.modelForm.mc_supervisory_authority = company[result];
                break;
            case 'numSiretOrSiren':
                this.modelForm.mc_siret_siren = company[result];
                break;
            case 'creationDate':
                this.modelForm.mc_creation_date = new Date(company[result]).toISOString().substring(0, 10);
                break;
            case 'shareCapital':
                this.modelForm.mc_share_capital = company[result];
                break;
            case 'commercialContact':
                this.modelForm.mc_commercial_contact = company[result];
                break;
            case 'operationalContact':
                this.modelForm.mc_operational_contact = company[result];
                break;
            case 'directorContact':
                this.modelForm.mc_director_contact = company[result];
                break;
            case 'lei':
                this.modelForm.mc_lei = company[result];
                break;
            case 'bic':
                this.modelForm.mc_bic = company[result];
                break;
            case 'giinCode':
                this.modelForm.mc_giin = company[result];
                break;
            case 'logoName':
                this.modelForm.mc_logo_name = company[result];
                break;
            case 'logoURL':
                this.modelForm.mc_logo = company[result];
                this.managementCompanyForm.controls['mc_logo'].patchValue(company[result]);
                break;
            }
        }
        this.showSearchTab = false;
        this.editForm = true;
    }

    resetForm(): void {
        this.editForm = false;
        this.showSearchTab = false;
        this.modelForm = {};
        this.managementCompanyForm.controls['mc_country_select'].setValue(['']);
        this.managementCompanyForm.reset();
    }

    deleteCompany(managementCompany: any) {
        // this.logService.log(managementCompany.companyID);
        const asyncTaskPipe = this.mcService.deleteManagementCompany({
            companyID: managementCompany.companyID,
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                this.mcService.fetchManagementCompanyList();
                // this.logService.log('success update sicav', data); // success
                // this.modalTitle = 'Information';
                // this.modalText = 'Your Management Company has been deleted successfully!';
                // this.showModal = true;
                this.showSearchTab = true;
                this.showSuccessResponse('Your Management Company has been deleted successfully!');
            },
            (data) => {
                this.logService.log('error: ', data);
            })
        );
    }

    save(formValues: ManagementCompanyInterface) {
        if (this.managementCompanyForm.valid) {
            // this.logService.log('editForm in save function', this.editForm);
            // this.logService.log('formValues in save function', formValues);
            // this.logService.log('formValues country', formValues.mc_country_select[0]);

            this.showSearchTab = false; // reset

            // update
            if (this.editForm) {
                const asyncTaskPipe = this.mcService.updateManagementCompany({
                    companyID: formValues.companyID,
                    companyName: formValues.mc_name,
                    emailAddress: formValues.mc_emailAddress,
                    country: formValues.mc_country_select[0],
                    addressPrefix: formValues.mc_addressPrefix,
                    postalAddressLine1: formValues.mc_address1,
                    postalAddressLine2: formValues.mc_address2,
                    city: formValues.mc_address3,
                    stateArea: formValues.mc_address4,
                    postalCode: formValues.mc_postalCode,
                    taxResidence: formValues.mc_tax_residence,
                    registrationNum: formValues.mc_registration_number,
                    supervisoryAuthority: formValues.mc_supervisory_authority,
                    numSiretOrSiren: formValues.mc_siret_siren,
                    creationDate: formValues.mc_creation_date,
                    shareCapital: formValues.mc_share_capital,
                    commercialContact: formValues.mc_commercial_contact,
                    operationalContact: formValues.mc_operational_contact,
                    directorContact: formValues.mc_director_contact,
                    lei: formValues.mc_lei,
                    bic: formValues.mc_bic,
                    giinCode: formValues.mc_giin,
                    logoName: formValues.mc_logo_name,
                    logoURL: formValues.mc_logo,
                });

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        this.mcService.fetchManagementCompanyList();
                        // this.logService.log('success update company', data); // success
                        // this.modalTitle = 'Information';
                        // this.modalText = 'Management company has successfully been updated';
                        // this.showModal = true;
                        this.resetForm();
                        this.showSearchTab = true;
                        this.showSuccessResponse('Management company has successfully been updated');
                    },
                    (data) => {
                        this.logService.log('error: ', data);
                    })
                );
            } else {
                // insert
                const asyncTaskPipe = this.mcService.saveManagementCompany({
                    companyID: formValues.companyID,
                    companyName: formValues.mc_name,
                    emailAddress: formValues.mc_emailAddress,
                    country: formValues.mc_country_select[0].id,
                    addressPrefix: formValues.mc_addressPrefix,
                    postalAddressLine1: formValues.mc_address1,
                    postalAddressLine2: formValues.mc_address2,
                    city: formValues.mc_address3,
                    stateArea: formValues.mc_address4,
                    postalCode: formValues.mc_postalCode,
                    taxResidence: formValues.mc_tax_residence,
                    registrationNum: formValues.mc_registration_number,
                    supervisoryAuthority: formValues.mc_supervisory_authority,
                    numSiretOrSiren: formValues.mc_siret_siren,
                    creationDate: formValues.mc_creation_date,
                    shareCapital: formValues.mc_share_capital,
                    commercialContact: formValues.mc_commercial_contact,
                    operationalContact: formValues.mc_operational_contact,
                    directorContact: formValues.mc_director_contact,
                    lei: formValues.mc_lei,
                    bic: formValues.mc_bic,
                    giinCode: formValues.mc_giin,
                    logoName: formValues.mc_logo_name,
                    logoURL: formValues.mc_logo
                });

                this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                    asyncTaskPipe,
                    (data) => {
                        this.mcService.fetchManagementCompanyList();

                        let tempPassword = data[1].Data[0].newPasswordString;

                        this.resetForm();
                        this.showSearchTab = true;
                        this.showSuccessResponse('Management company has successfully been created.<br><br>Temporary password: ' + tempPassword);
                    },
                    (data) => {
                        this.logService.log('error: ', data);
                    })
                );
            }
        }
    }

    /* UPLOAD */
    /**
     * On Drop Files subscriber
     *
     * @param event
     *
     * @return {void}
     */
    public onDropFiles(event, form, fieldName) {
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, function (file) {
                return file.status !== 'uploaded-file';
            })
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (function (data) {
                if (data[1] && data[1].Data) {
                    let errorMessage = '';
                    _.each(data[1].Data, function (file) {
                        if (file.error) {
                            errorMessage += file.error + '<br/>';
                            event.target.updateFileStatus(file.id, 'file-error');
                        } else {
                            event.target.updateFileStatus(file[0].id, 'uploaded-file');
                            // this.logService.log(form, fieldName, file[0].fileHash);
                            form.controls[fieldName].patchValue(file[0].fileHash);
                        }
                    });
                    if (errorMessage) {
                        this.showAlert(errorMessage, 'error');
                    }
                    // clean field in form when remove file
                    if (data[1].Data.length === 0) {
                        form.controls[fieldName].patchValue(null);
                    }
                    this.markForCheck();
                }
            }).bind(this),
            function (data) {
                let errorMessage = '';
                _.each(data[1].Data, function (file) {
                    if (file.error) {
                        errorMessage += file.error + '<br/>';
                        event.target.updateFileStatus(file.id, 'file-error');
                    }
                });
                if (errorMessage) {
                    this.showAlert(errorMessage, 'error');
                }
            })
        );
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }

    showErrorResponse(response) {

        const message = _.get(response, '[1].Data[0].Message', '');

        this.alertsService.create('error', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showSuccessResponse(message) {

        this.alertsService.create('success', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-success">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }

    showInvalidForm(message) {
        this.alertsService.create('error', `
                    <table class="table grid">

                        <tbody>
                            <tr>
                                <td class="text-center text-danger">${message}</td>
                            </tr>
                        </tbody>
                    </table>
                    `);
    }
}
