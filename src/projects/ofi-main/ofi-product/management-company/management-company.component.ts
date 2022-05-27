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
import { MultilingualService } from '@setl/multilingual';
import * as moment from 'moment-timezone';

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
    managemementCompanySecurityAddIpForm: FormGroup;
    displaySecurityTab: boolean = false;
    isProduction = true;
    editForm = false;
    showSearchTab = false;
    securityTab = false;
    showModal = false;
    modalTitle = '';
    modalText = '';

    securityInformationsData: any = {};
    managementCompanySecurityRestrictionToggle: boolean = false;
    managementCompanySecurityRestrictionActivated: boolean = false;
    managementCompanyRestrictedPort: number = 443;
    showAddIpAddressModal = false;
    securityToggleDisabled: boolean = false;

    panelDef: any = {};
    panelColumns = {};

    showConfirmModal = false;
    companyToDelete: any;

    fileMetadata = new ManagementCompanyFileMetadata();

    managementCompanyList = [];
    countries;
    phoneNumbersCountryCodes;
    legalFormList;
    managementCompanyTypes = [{id: 'common', text: 'Common'}, {id: 'nowcp', text: 'NowCP'}, {id: 'id2s', text: 'ID2S'}];

    unSubscribe: Subject<any> = new Subject();

    // List of redux observable.
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['user', 'myDetail', 'userType']) usertype$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyList$;
    @select(['user', 'siteSettings', 'production']) isProduction$;

    constructor(
        private ngRedux: NgRedux<any>,
        private mcService: OfiManagementCompanyService,
        private changeDetectorRef: ChangeDetectorRef,
        private logService: LogService,
        private alertsService: AlertsService,
        private toasterSevice: ToasterService,
        private service: ManagagementCompanyService,
        private location: Location,
        public translate: MultilingualService,
        @Inject('phoneCodeList') phoneCodeList,
        @Inject('product-config') productConfig,
    ) {
        this.mcService.getManagementCompanyList();

        this.countries = this.translate.translate(productConfig.fundItems.domicileItems);
        this.phoneNumbersCountryCodes = phoneCodeList;
        this.legalFormList = this.translate.translate(legalFormList);

        this.managementCompanyForm = this.service.generateForm();
        this.managemementCompanySecurityAddIpForm = this.service.generateAddIpAddressForm();

        this.initPanelColumns();
        this.initPanelDefinition();
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
                    this.mcService.getSecurityInformations().then((result) => {
                        const data = result[1].Data;

                        if (data.error) {
                            return this.toasterSevice.pop('error', this.translate.translate(`Unable to get security informations : ${data}`));
                        } else {
                            this.managementCompanySecurityRestrictionActivated = data[0].apiEnableSecurity || false;
                            this.managementCompanySecurityRestrictionToggle = this.managementCompanySecurityRestrictionActivated;
                            this.managementCompanyRestrictedPort = data[0].apiRestrictionPort || undefined;

                            if (data[0].ipAddresses && data[0].ipAddresses !== []) {
                                const ipAddresses = _.map(data[0].ipAddresses, ip => {
                                    return {
                                        ...ip,
                                        dateEntered: moment(ip.dateEntered).tz(moment.tz.guess()).format('YYYY-MM-DD HH:mm'),
                                    }
                                });

                                this.panelDef.data = ipAddresses || [];   
                            }

                            this.detectChanges(true);
                        }
                    });
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
            // todo
            // need better approach
            // it always empty array at the moment (because we do not need to update the type of management company now), put it in just to satisfy the form group.
            managementCompanyType: [],
        });
        this.fileMetadata.setProperties({
            signatureTitle: company.signatureTitle,
            signatureHash: company.signatureHash,
            logoTitle: company.logoTitle,
            logoHash: company.logoHash,
        });

        this.showSearchTab = false;
        this.securityTab = false;
        this.editForm = true;
        this.markForCheck();
    }

    resetForm(): void {
        this.editForm = false;
        this.showSearchTab = false;
        this.securityTab = false;
        this.managementCompanyForm = this.service.generateForm();
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
                this.showSuccessResponse(this.translate.translate('Your Management Company has been deleted successfully'));
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

                let message;

                if (this.editForm) {
                    message = this.translate.translate('Management company has successfully been updated');
                } else {
                    message = this.translate.translate('Management company has successfully been created');
                }

                this.showSuccessResponse(message);

                if (this.isAssetManager) {
                    this.location.back();
                }
            },
            (data) => {
                this.logService.log('error: ', data);

                const action = this.editForm ? 'update' : 'create';
                const errorMessage = _.get(data, '[1].Data[0].Message', '');

                const message = `
                    ${this.translate.translate('Fail to @action@ management company.', { 'action': action })} 
                    ${this.translate.translate(errorMessage)}`;

                this.toasterSevice.pop(
                    'error',
                    message,
                );
            }),
        );
    }

    markForCheck() {
        this.changeDetectorRef.markForCheck();
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
            </table>`,
        );
    }

    handleSecurityControlToggleClick() {
        this.securityToggleDisabled = true;

        this.mcService.defaultToggleSecurityRestriction(this.managementCompanySecurityRestrictionToggle, (result) => {
            const data = result[1].Data;

            if (data.error) {
                this.toasterSevice.pop('error', this.translate.translate('There is a problem with the request.'));
                // back to previous status
                this.managementCompanySecurityRestrictionToggle = !this.managementCompanySecurityRestrictionToggle;
            } else {
                if (data[0].Status === 'OK') {
                    this.managementCompanySecurityRestrictionActivated = data[0].apiEnableSecurity;
                    this.managementCompanySecurityRestrictionToggle = data[0].apiEnableSecurity;
                    this.toasterSevice.pop('success', this.translate.translate('Updated Security Control Status'));
                } else {
                    console.log(data[0]);
                    // back to previous status
                    this.managementCompanySecurityRestrictionToggle = !this.managementCompanySecurityRestrictionToggle;
                    this.toasterSevice.pop('error', this.translate.translate(`There is a problem with the request: ${data[0].Message}`));
                }
            }
            
            // update frontend state
            this.securityToggleDisabled = false;
            this.changeDetectorRef.detectChanges();
        }, (error) => {
            const data = error[1].Data;
            const errorMessage = _.get(data, '0.Message', 'There is a problem with the request');

            // display error message if exist
            this.toasterSevice.pop('error', this.translate.translate(errorMessage));
            this.managementCompanySecurityRestrictionToggle = !this.managementCompanySecurityRestrictionToggle;
            
            // update frontend state
            this.securityToggleDisabled = false;
            this.changeDetectorRef.detectChanges();
        })
    }

    initPanelColumns(): void {
        this.panelColumns = {
            ipAddress: {
                label: this.translate.translate('IP Address'),
                dataSource: 'ipAddress',
                sortable: true,
            },
            date: {
                label: this.translate.translate('Date Entered'),
                dataSource: 'dateEntered',
                sortable: true,
            },
            description: {
                label: this.translate.translate('Description'),
                dataSource: 'description',
            },
            userEntered: {
                label: this.translate.translate('Created by'),
                dataSource: 'userEntered',
            },
            action: {
                label: this.translate.translate('Action'),
                dataSource: 'RN',
                type: 'button',
            },
        };
    }

    initPanelDefinition() {
        this.panelDef = {
          columns: [
            this.panelColumns['ipAddress'],
            this.panelColumns['date'],
            this.panelColumns['description'],
            this.panelColumns['userEntered'],
            this.panelColumns['action'],
          ],
          open: true,
          data: [],
        };
    }

    /* unused for now */
    refresh(state) {}

    deleteIPAddress(id) {
        if (!id) return;

        this.mcService.deleteSecurityIpAddressManagementCompany(id).then((result) => {
            const data = result[1].Data;

            if (data.error) {
                return this.toasterSevice.pop('error', this.translate.translate('There is a problem with the request.'));
            } else {
                if (data[0].Status === 'OK') {
                    _.remove(this.panelDef.data, item => item.RN === id);
                    this.changeDetectorRef.detectChanges();
                    return this.toasterSevice.pop('success', this.translate.translate('IP Address deleted.'));
                } else {
                    return this.toasterSevice.pop('error', this.translate.translate(`There is a problem with the request: ${data[0].Message}`));
                }
            }
        });
    }

    closeAddIpAddressModal() {
        this.showAddIpAddressModal = false;
        this.managemementCompanySecurityAddIpForm = this.service.generateAddIpAddressForm();
        this.changeDetectorRef.detectChanges();
    }

    addIPAddress() {
        // prevent sending data if invalid fields
        if (!this.managemementCompanySecurityAddIpForm.valid) {
            return;
        }
        
        const request = {
            ipAddress: this.managemementCompanySecurityAddIpForm.controls['ipAddress'].value,
            description: this.managemementCompanySecurityAddIpForm.controls['description'].value,
        }

        this.mcService.addSecurityIpAddressManagementCompany(request).then((result) => {
            const data = result[1].Data;

            if (data.error) {
                this.closeAddIpAddressModal();
                return this.toasterSevice.pop('error', this.translate.translate('There is a problem with the request.'));
            } else {
                if (data[0].Status === 'OK') {
                    this.panelDef.data.push({
                        ...data[0],
                        dateEntered: moment(data[0].dateEntered).tz(moment.tz.guess()).format('YYYY-MM-DD HH:mm'), 
                    });
                    this.closeAddIpAddressModal();
                    return this.toasterSevice.pop('success', this.translate.translate('New IP Address added.'));

                } else {
                    this.closeAddIpAddressModal();
                    return this.toasterSevice.pop('error', this.translate.translate(`There is a problem with the request: ${data[0].Message}`));
                }
            }
        });
    }

    detectChanges(detect = false) {
        this.changeDetectorRef.markForCheck();

        if (detect) {
          this.changeDetectorRef.detectChanges();
        }
    }
}
