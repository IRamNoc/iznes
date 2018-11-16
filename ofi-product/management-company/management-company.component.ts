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
import { FileDropEvent } from '@setl/core-filedrop';

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
    isProduction = true;
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
    @select(['user', 'siteSettings', 'production']) isProduction$;

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

        this.isProduction$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe(isProduction => this.isProduction = isProduction);

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
    }

    get isAssetManager(): boolean {
        return this.usertype === AM_USERTYPE;
    }

    get isFormValid(): boolean {
        return this.managementCompanyForm.valid && (!this.isProduction || this.fileMetadata.isValid());
    }

    public onDropFile(filedropEvent: FileDropEvent, fieldName: ManagementCompanyFileMetadataField) {
        const hasFiles = filedropEvent.files.length;
        this.fileMetadata.setProperty(
            fieldName,
            {
                title: hasFiles ? filedropEvent.files[0].name : null,
                hash: hasFiles ? `data:${filedropEvent.files[0].mimeType};base64,${filedropEvent.files[0].data}` : null,
            },
        );

        this.markForCheck();
    }

    public getCountryName(countryAbbreviation: string): string {
        const thisCountryData = _.find(this.countries, { id: countryAbbreviation });

        if (thisCountryData) {
            return thisCountryData.text;
        }
        return '';
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

        if (!this.isFormValid) {
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

        const asyncTaskPipe = this.editForm
            ? this.mcService.updateManagementCompany(payload)
            : this.mcService.saveManagementCompany(payload);

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.mcService.fetchManagementCompanyList();
                this.resetForm();
                this.showSearchTab = true;
                this.showSuccessResponse(`Management company has successfully been ${this.editForm ? 'updated' : 'created'}.`);
                if (this.isAssetManager) {
                    this.location.back();
                }
            },
            (data) => {
                this.logService.log('error: ', data);
                this.toasterSevice.pop('error', `failed to ${this.editForm ? 'update' : 'create'} management company`);
            }),
        );
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }

    showSuccessResponse(message) {
        this.alertsService.create(
            'success',
            `<table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">${message}</td>
                    </tr>
                </tbody>
            </table>`
        );
    }
}
