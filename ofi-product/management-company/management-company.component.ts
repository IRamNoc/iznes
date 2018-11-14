import * as _ from 'lodash';
import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import { takeUntil, take, switchMap, filter } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';

import { SagaHelper, LogService } from '@setl/utils';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { ManagagementCompanyService } from './management-company.service';
import { ManagementCompanyListState } from '../../ofi-store/ofi-product/management-company';
import { ManagementCompanyFileMetadata, ManagementCompanyFileMetadataField } from './management-company-file-metadata';
import { legalFormList } from '../../ofi-kyc/my-requests/requests.config';

const AM_USERTYPE = 36;

@Component({
    selector: 'management-company',
    styleUrls: ['./management-company.component.scss'],
    templateUrl: './management-company.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class OfiManagementCompanyComponent implements OnInit, OnDestroy {

    language = 'en';
    private usertype: number;

    managementCompanyForm: FormGroup;
    isWalletConnected = false;
    editForm = false;
    showSearchTab = false;
    showModal = false;
    modalTitle = '';
    modalText = '';

    showConfirmModal = false;
    companyToDelete: any;

    fileMetadata = new ManagementCompanyFileMetadata();

    managementCompanyList = [];
    countries;
    phoneNumbersCountryCodes;
    legalFormList = legalFormList;

    unSubscribe: Subject<any> = new Subject();

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['user', 'myDetail', 'userType']) usertype$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyList$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    constructor(
        private ngRedux: NgRedux<any>,
        private mcService: OfiManagementCompanyService,
        private _changeDetectorRef: ChangeDetectorRef,
        private logService: LogService,
        private alertsService: AlertsService,
        private toasterSevice: ToasterService,
        private service: ManagagementCompanyService,
        private location: Location,
        @Inject('phoneCodeList') phoneCodeList,
        @Inject('product-config') productConfig,
    ) {
        this.mcService.getManagementCompanyList();

        this.countries = productConfig.fundItems.domicileItems;
        this.phoneNumbersCountryCodes = phoneCodeList;

        this.managementCompanyForm = this.service.generateForm();
    }

    ngOnInit() {
        this.language$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(language => this.setLanguage(language));

        this.usertype$
            .pipe(
                take(2),
                takeUntil(this.unSubscribe),
            )
            .subscribe((usertype) => {
                this.usertype = usertype;
            });

        this.managementCompanyList$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((managementCompanyList: ManagementCompanyListState) => {
                this.managementCompanyList = _.values(managementCompanyList);
                this.markForCheck();
            });

        this.usertype$
            .pipe(
                switchMap(() => this.managementCompanyList$),
                filter(l => !!Object.keys(l).length),
                takeUntil(this.unSubscribe),
            )
            .subscribe((managementCompanyList) => {
                if (this.isAssetManager) {
                    this.editCompany(_.values(managementCompanyList)[0]);
                }
            });

        this.connectedWallet$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((connectedWallet) => {
                this.isWalletConnected = !!connectedWallet;
                this.markForCheck();
            });
    }

    get isAssetManager(): boolean {
        return this.usertype === AM_USERTYPE;
    }

    public onDropFile(filedropEvent, fieldName: ManagementCompanyFileMetadataField) {
        if (!filedropEvent.files.length) {
            this.fileMetadata.setProperty(
                fieldName,
                {
                    title: null,
                    hash: null,
                },
            );
            this.markForCheck();
            return;
        }
        this.service.uploadFile(filedropEvent, this.managementCompanyForm.controls[fieldName])
            .then((res) => {
                if (res) {
                    this.toasterSevice.pop('success', `${res.name} successfully uploaded`);
                }
                this.fileMetadata.setProperty(
                    fieldName,
                    {
                        title: res.name,
                        hash: res.hash,
                    },
                );
                this.markForCheck();
            })
            .catch((err) => {
                this.toasterSevice.pop('error', `failed to upload file: ${err}`);
            });
    }

    public getCountryName(countryAbbreviation: string): string {
        return _.find(this.countries, { id: countryAbbreviation }).text;
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    setLanguage(language: string): void {
        this.logService.log('Language changed from ' + this.language + ' to ' + language);
        switch (language) {
            case 'fra':
                this.language = 'fr';
                break;
            case 'eng':
            default:
                this.language = 'en';
                break;
        }
    }

    confirmModal(response): void {
        this.showConfirmModal = false;
        if (response === 1) {
            this.deleteCompany(this.companyToDelete);
        }
    }

    public editCompany(company) {
        this.managementCompanyForm.setValue({
            ..._.omit(company, ['signatureTitle', 'signatureHash', 'logoTitle', 'logoHash']),
            country: [_.find(this.countries, { id: company.country })],
            taxResidence: [_.find(this.countries, { id: company.taxResidence })],
            legalFormName: [_.find(this.legalFormList, { id: company.legalFormName })],
            phoneNumberPrefix: [_.find(this.phoneNumbersCountryCodes, { id: company.phoneNumberPrefix })],
            signature: null,
            logo: null,
        });
        this.fileMetadata.setProperties({
            signatureTitle: company.signatureTitle,
            signatureHash: company.signatureHash,
            logoTitle: company.logoTitle,
            logoHash: company.logoHash,
        });

        this.showSearchTab = false;
        this.editForm = true;
        this.markForCheck();
    }

    resetForm(): void {
        this.editForm = false;
        this.showSearchTab = false;
        this.managementCompanyForm.reset();
        this.fileMetadata.reset();
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
            }),
        );
    }

    save() {

        if (!this.managementCompanyForm.valid || !this.fileMetadata.isValid()) {
            return;
        }

        const payload = {
            ...this.managementCompanyForm.value,
            country: this.managementCompanyForm.controls['country'].value[0].id,
            taxResidence: this.managementCompanyForm.controls['taxResidence'].value[0].id,
            legalFormName: this.managementCompanyForm.controls['legalFormName'].value[0].id,
            phoneNumberPrefix: this.managementCompanyForm.controls['phoneNumberPrefix'].value[0].id,
            ...this.fileMetadata.getProperties(),
        };

        this.showSearchTab = false; // reset

        // update
        if (this.editForm) {
            const asyncTaskPipe = this.mcService.updateManagementCompany(payload);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.mcService.fetchManagementCompanyList();
                    this.resetForm();
                    this.showSearchTab = true;
                    this.showSuccessResponse('Management company has successfully been updated');
                    if (this.isAssetManager) {
                        this.location.back();
                    }
                },
                (data) => {
                    this.logService.log('error: ', data);
                    this.toasterSevice.pop('error', 'failed to update management company');
                }),
            );
        } else {
            // insert
            const asyncTaskPipe = this.mcService.saveManagementCompany(payload);

            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    this.mcService.fetchManagementCompanyList();

                    const tempPassword = data[1].Data[0].newPasswordString;

                    this.resetForm();
                    this.showSearchTab = true;
                    this.showSuccessResponse('Management company has successfully been created.<br><br>Temporary password: ' + tempPassword);
                },
                (data) => {
                    this.logService.log('error: ', data);
                    this.toasterSevice.pop('error', 'failed to create management company');
                }),
            );
        }
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
