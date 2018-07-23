import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import { fromJS } from 'immutable';
import {
    SET_KYC_DETAILS_GENERAL,
    SET_KYC_DETAILS_COMPANY,
    SET_KYC_DETAILS_COMPANYBENEFICIARIES,
    SET_KYC_DETAILS_BANKING,
    SET_KYC_DETAILS_CLASSIFICATION,
    SET_KYC_DETAILS_RISKNATURE,
    SET_KYC_DETAILS_RISKOBJECTIVES,
    SET_KYC_DETAILS_DOCUMENTS,

    setkycdetailsgeneralrequested,
    setkycdetailscompanyrequested,
    setkycdetailscompanybeneficiariesrequested,
    setkycdetailsbankingrequested,
    setkycdetailsclassificationrequested,
    setkycdetailsrisknaturerequested,
    setkycdetailsriskobjectivesrequested,
    setkycdetailsdocumentsrequested,

    clearkycdetailsgeneralrequested,
    clearkycdetailscompanyrequested,
    clearkycdetailscompanybeneficiariesrequested,
    clearkycdetailsbankingrequested,
    clearkycdetailsclassificationrequested,
    clearkycdetailsrisknaturerequested,
    clearkycdetailsriskobjectivesrequested,
    clearkycdetailsdocumentsrequested,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/index';

import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'my-requests-details',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyRequestsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() kycID : number = 1;

    isDebug = true;
    showModal = false;

    disabledForm: FormGroup;

    companyName: string = '';
    lastUpdate: string = 'YYYY-MM-DD 00:00:00';
    requestDetailStatus = 'accepted';
    isKYCFull = true;

    /* Services */
    // getKycGeneral
    // getKycCompany
    // getKycCompanybeneficiaries // modal
    // getKycBanking
    // getKycClassification
    // getKycRisknature
    // getKycRiskobjective // (objectives + constraints)
    // getKycDocument

    panelDefs = [];
    fakeDatas = [
        [
            {
                value: 'this is a test',
                action: '',
                link: '',
                file: '',
            },
            {
                value: 'fake value',
                action: '',
                link: '',
                file: '',
            },
        ],
        [
            {
                value: 'Document',
                action: '',
                link: '',
                file: '',
            },
            {
                value: '',
                action: '',
                link: '',
                file: '1234',
            },
        ],
        [
            {
                value: 'this is a test',
                action: '',
                link: '',
                file: '',
            },
            {
                value: 'See details',
                action: 'beneficiariesModal',
                link: '',
                file: '',
            },
        ],
        [
            {
                value: 'this is a test',
                action: '',
                link: '',
                file: '',
            },
            {
                value: 'Go here',
                action: '',
                link: '/home',
                file: '',
            },
        ],
    ];
    beneficariesData = [];

    private subscriptions: Array<any> = [];

    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsGeneralRequested']) kycDetailsGeneralRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsGeneral']) kycDetailsGeneralOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsCompanyRequested']) kycDetailsCompanyRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsCompany']) kycDetailsCompanyOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsCompanyBeneficiariesRequested']) kycDetailsCompanyBeneficiariesRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsCompanyBeneficiaries']) kycDetailsCompanyBeneficiariesOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsBankingRequested']) kycDetailsBankingRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsBanking']) kycDetailsBankingOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsClassificationRequested']) kycDetailsClassificationRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsClassification']) kycDetailsClassificationOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsRisknatureRequested']) kycDetailsRisknatureRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsRisknature']) kycDetailsRisknatureOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsRiskobjectiveRequested']) kycDetailsRiskobjectiveRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsRiskobjective']) kycDetailsRiskobjectiveOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsDocumentsRequested']) kycDetailsDocumentsRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycDetails', 'kycDetailsDocuments']) kycDetailsDocumentsOb;

    constructor(
        private _fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _ofiKycService: OfiKycService,
        private _toasterService: ToasterService,
        public _translate: MultilingualService,
        private ngRedux: NgRedux<any>,
    ) {
        this.constructPanels();
        this.constructDisabledForm();
    }

    ngOnInit() {
        this.subscriptions.push(this.kycDetailsGeneralRequestedOb.subscribe((kycDetailsGeneralRequested) => this.requestKycDetailsGeneral(kycDetailsGeneralRequested)));
        this.subscriptions.push(this.kycDetailsGeneralOb.subscribe(kycDetailsGeneral => this.getKycDetailsGeneral(kycDetailsGeneral)));
        this.subscriptions.push(this.kycDetailsCompanyRequestedOb.subscribe((kycDetailsCompanyRequested) => this.requestKycDetailsCompany(kycDetailsCompanyRequested)));
        this.subscriptions.push(this.kycDetailsCompanyOb.subscribe(kycDetailsCompany => this.getKycDetailsCompany(kycDetailsCompany)));
        this.subscriptions.push(this.kycDetailsCompanyBeneficiariesRequestedOb.subscribe((kycDetailsCompanyBeneficiariesRequested) => this.requestKycDetailsCompanyBeneficiaries(kycDetailsCompanyBeneficiariesRequested)));
        this.subscriptions.push(this.kycDetailsCompanyBeneficiariesOb.subscribe(kycDetailsCompanyBeneficiaries => this.getKycDetailsCompanyBeneficiaries(kycDetailsCompanyBeneficiaries)));
        this.subscriptions.push(this.kycDetailsBankingRequestedOb.subscribe((kycDetailsBankingRequested) => this.requestKycDetailsBanking(kycDetailsBankingRequested)));
        this.subscriptions.push(this.kycDetailsBankingOb.subscribe(kycDetailsBanking => this.getKycDetailsBanking(kycDetailsBanking)));
        this.subscriptions.push(this.kycDetailsClassificationRequestedOb.subscribe((kycDetailsClassificationRequested) => this.requestKycDetailsClassification(kycDetailsClassificationRequested)));
        this.subscriptions.push(this.kycDetailsClassificationOb.subscribe(kycDetailsClassification => this.getKycDetailsClassification(kycDetailsClassification)));
        this.subscriptions.push(this.kycDetailsRisknatureRequestedOb.subscribe((kycDetailsRisknatureRequested) => this.requestKycDetailsRisknature(kycDetailsRisknatureRequested)));
        this.subscriptions.push(this.kycDetailsRisknatureOb.subscribe(kycDetailsRisknature => this.getKycDetailsRisknature(kycDetailsRisknature)));
        this.subscriptions.push(this.kycDetailsRiskobjectiveRequestedOb.subscribe((kycDetailsRiskobjectiveRequested) => this.requestKycDetailsRiskobjective(kycDetailsRiskobjectiveRequested)));
        this.subscriptions.push(this.kycDetailsRiskobjectiveOb.subscribe(kycDetailsRiskobjective => this.getKycDetailsRiskobjective(kycDetailsRiskobjective)));
        this.subscriptions.push(this.kycDetailsDocumentsRequestedOb.subscribe((kycDetailsDocumentsRequested) => this.requestKycDetailsDocuments(kycDetailsDocumentsRequested)));
        this.subscriptions.push(this.kycDetailsDocumentsOb.subscribe(kycDetailsDocuments => this.getKycDetailsDocuments(kycDetailsDocuments)));
    }

    requestKycDetailsGeneral(kycDetailsGeneralRequested): void {
        if (!kycDetailsGeneralRequested) {
            OfiKycService.defaultRequestKycDetailsGeneral(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsGeneral(kycDetailsGeneral) {
        const listImu = fromJS(kycDetailsGeneral);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsCompany(kycDetailsCompanyRequested): void {
        if (!kycDetailsCompanyRequested) {
            OfiKycService.defaultRequestKycDetailsCompany(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsCompany(kycDetailsCompany) {
        const listImu = fromJS(kycDetailsCompany);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsCompanyBeneficiaries(kycDetailsCompanyBeneficiariesRequested): void {
        if (!kycDetailsCompanyBeneficiariesRequested) {
            OfiKycService.defaultRequestKycDetailsCompanyBeneficiaries(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsCompanyBeneficiaries(kycDetailsCompanyBeneficiaries) {
        const listImu = fromJS(kycDetailsCompanyBeneficiaries);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsBanking(kycDetailsBankingRequested): void {
        if (!kycDetailsBankingRequested) {
            OfiKycService.defaultRequestKycDetailsBanking(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsBanking(kycDetailsBanking) {
        const listImu = fromJS(kycDetailsBanking);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsClassification(kycDetailsClassificationRequested): void {
        if (!kycDetailsClassificationRequested) {
            OfiKycService.defaultRequestKycDetailsClassification(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsClassification(kycDetailsClassification) {
        const listImu = fromJS(kycDetailsClassification);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsRisknature(kycDetailsRisknatureRequested): void {
        if (!kycDetailsRisknatureRequested) {
            OfiKycService.defaultRequestKycDetailsRiskNature(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsRisknature(kycDetailsRisknature) {
        const listImu = fromJS(kycDetailsRisknature);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsRiskobjective(kycDetailsRiskobjectiveRequested): void {
        if (!kycDetailsRiskobjectiveRequested) {
            OfiKycService.defaultRequestKycDetailsRiskObjectives(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsRiskobjective(kycDetailsRiskobjective) {
        const listImu = fromJS(kycDetailsRiskobjective);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycDetailsDocuments(kycDetailsDocumentsRequested): void {
        if (!kycDetailsDocumentsRequested) {
            OfiKycService.defaultRequestKycDetailsDocuments(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycDetailsDocuments(kycDetailsDocuments) {
        const listImu = fromJS(kycDetailsDocuments);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            document.getElementById('blocStatus').style.opacity = '1';
        }, 1500);
    }

    constructPanels() {
        this.panelDefs = [
            {
                id: 'request-details-identification',
                title: 'Identification',
                open: true,
                columns: [],
                data: [],
                childs: [
                    {
                        id: 'request-details-general-information',
                        title: 'General Information',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-company-information',
                        title: 'Company Information',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-banking-information',
                        title: 'Banking Information',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-classification-confirmation',
                        title: 'Classification Confirmation',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                ]
            },
            {
                id: 'request-details-risk-profile',
                title: 'Risk Profile',
                open: true,
                columns: [],
                data: [],
                childs: [
                    {
                        id: 'request-details-investments-nature',
                        title: 'Investments\' Nature',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-investments-objectives',
                        title: 'Investments\' Objectives',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-investments-constraints',
                        title: 'Investments\' Constraints',
                        open: false,
                        columns: [{label: 'Information'}, {label: 'Value'},],
                        data: this.fakeDatas,
                    },
                ]
            },
            {
                id: 'request-details-documents',
                title: 'Documents',
                open: false,
                columns: [{label: 'Information'}, {label: 'Value'},],
                data: this.fakeDatas,
                childs: [],
            },
        ];
    }

    constructDisabledForm() {

        this.disabledForm = this._fb.group({
            firstName: new FormControl({value: 'first name', disabled: true}),
            lastName: new FormControl({value: 'last name', disabled: true}),
            email: new FormControl({value: 'email address', disabled: true}),
            phone: new FormControl({value: 'phone number', disabled: true}),
            rejectionMessage: new FormControl({value: '(AM\'s message when reject)', disabled: true}),
            informationMessage: new FormControl({value: '(AM\'s message when ask for more information)', disabled: true}),
        });
    }

    constructBeneficiaries() {
        const fakeLoop = [1,2,3,4,5];
        this.beneficariesData = []; // reset
        let num = 1;
        for (let i in fakeLoop) {
            this.beneficariesData.push({
                id: 'request-details-beneficary-b' + i,
                title: 'Beneficary ' + num + ' (think to add firstName lastName)',
                columns: [{label: 'Information'}, {label: 'Value'}],
                data: this.fakeDatas,
            });
            num++;
        }
    }

    beneficiariesModal() {
        this.constructBeneficiaries();
        this.showModal = true;
    }

    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();
    }
}
