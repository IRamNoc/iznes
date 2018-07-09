import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import { fromJS } from 'immutable';
import {
    SET_KYC_MYREQ_DETAILS_GENERAL,
    setkycmyreqdetailsgeneralrequested,
    clearkycmyreqdetailsgeneralrequested,
    SET_KYC_MYREQ_DETAILS_COMPANY,
    setkycmyreqdetailscompanyrequested,
    clearkycmyreqdetailscompanyrequested,
    SET_KYC_MYREQ_DETAILS_COMPANYBENEFICIARIES,
    setkycmyreqdetailscompanybeneficiariesrequested,
    clearkycmyreqdetailscompanybeneficiariesrequested,
    SET_KYC_MYREQ_DETAILS_BANKING,
    setkycmyreqdetailsbankingrequested,
    clearkycmyreqdetailsbankingrequested,
    SET_KYC_MYREQ_DETAILS_CLASSIFICATION,
    setkycmyreqdetailsclassificationrequested,
    clearkycmyreqdetailsclassificationrequested,
    SET_KYC_MYREQ_DETAILS_RISKNATURE,
    setkycmyreqdetailsrisknaturerequested,
    clearkycmyreqdetailsrisknaturerequested,
    SET_KYC_MYREQ_DETAILS_RISKOBJECTIVES,
    setkycmyreqdetailsriskobjectivesrequested,
    clearkycmyreqdetailsriskobjectivesrequested,
    SET_KYC_MYREQ_DETAILS_DOCUMENTS,
    setkycmyreqdetailsdocumentsrequested,
    clearkycmyreqdetailsdocumentsrequested,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/index';

import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-request-details',
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiKycRequestDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    isDebug = true;
    showModal = false;

    disabledForm: FormGroup;

    kycID: number = 1; // come from Inputs from Thomas component

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

    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsGeneralRequested']) kycMyRequestDetailsGeneralRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsGeneral']) kycMyRequestDetailsGeneralOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsCompanyRequested']) kycMyRequestDetailsCompanyRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsCompany']) kycMyRequestDetailsCompanyOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsCompanyBeneficiariesRequested']) kycMyRequestDetailsCompanyBeneficiariesRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsCompanyBeneficiaries']) kycMyRequestDetailsCompanyBeneficiariesOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsBankingRequested']) kycMyRequestDetailsBankingRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsBanking']) kycMyRequestDetailsBankingOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsClassificationRequested']) kycMyRequestDetailsClassificationRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsClassification']) kycMyRequestDetailsClassificationOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsRisknatureRequested']) kycMyRequestDetailsRisknatureRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsRisknature']) kycMyRequestDetailsRisknatureOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsRiskobjectiveRequested']) kycMyRequestDetailsRiskobjectiveRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsRiskobjective']) kycMyRequestDetailsRiskobjectiveOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsDocumentsRequested']) kycMyRequestDetailsDocumentsRequestedOb;
    @select(['ofi', 'ofiKyc', 'kycMyRequestDetails', 'kycMyRequestDetailsDocuments']) kycMyRequestDetailsDocumentsOb;

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
        this.subscriptions.push(this.kycMyRequestDetailsGeneralRequestedOb.subscribe((kycMyRequestDetailsGeneralRequested) => this.requestKycMyRequestDetailsGeneral(kycMyRequestDetailsGeneralRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsGeneralOb.subscribe(kycMyRequestDetailsGeneral => this.getKycMyRequestDetailsGeneral(kycMyRequestDetailsGeneral)));
        this.subscriptions.push(this.kycMyRequestDetailsCompanyRequestedOb.subscribe((kycMyRequestDetailsCompanyRequested) => this.requestKycMyRequestDetailsCompany(kycMyRequestDetailsCompanyRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsCompanyOb.subscribe(kycMyRequestDetailsCompany => this.getKycMyRequestDetailsCompany(kycMyRequestDetailsCompany)));
        this.subscriptions.push(this.kycMyRequestDetailsCompanyBeneficiariesRequestedOb.subscribe((kycMyRequestDetailsCompanyBeneficiariesRequested) => this.requestKycMyRequestDetailsCompanyBeneficiaries(kycMyRequestDetailsCompanyBeneficiariesRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsCompanyBeneficiariesOb.subscribe(kycMyRequestDetailsCompanyBeneficiaries => this.getKycMyRequestDetailsCompanyBeneficiaries(kycMyRequestDetailsCompanyBeneficiaries)));
        this.subscriptions.push(this.kycMyRequestDetailsBankingRequestedOb.subscribe((kycMyRequestDetailsBankingRequested) => this.requestKycMyRequestDetailsBanking(kycMyRequestDetailsBankingRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsBankingOb.subscribe(kycMyRequestDetailsBanking => this.getKycMyRequestDetailsBanking(kycMyRequestDetailsBanking)));
        this.subscriptions.push(this.kycMyRequestDetailsClassificationRequestedOb.subscribe((kycMyRequestDetailsClassificationRequested) => this.requestKycMyRequestDetailsClassification(kycMyRequestDetailsClassificationRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsClassificationOb.subscribe(kycMyRequestDetailsClassification => this.getKycMyRequestDetailsClassification(kycMyRequestDetailsClassification)));
        this.subscriptions.push(this.kycMyRequestDetailsRisknatureRequestedOb.subscribe((kycMyRequestDetailsRisknatureRequested) => this.requestKycMyRequestDetailsRisknature(kycMyRequestDetailsRisknatureRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsRisknatureOb.subscribe(kycMyRequestDetailsRisknature => this.getKycMyRequestDetailsRisknature(kycMyRequestDetailsRisknature)));
        this.subscriptions.push(this.kycMyRequestDetailsRiskobjectiveRequestedOb.subscribe((kycMyRequestDetailsRiskobjectiveRequested) => this.requestKycMyRequestDetailsRiskobjective(kycMyRequestDetailsRiskobjectiveRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsRiskobjectiveOb.subscribe(kycMyRequestDetailsRiskobjective => this.getKycMyRequestDetailsRiskobjective(kycMyRequestDetailsRiskobjective)));
        this.subscriptions.push(this.kycMyRequestDetailsDocumentsRequestedOb.subscribe((kycMyRequestDetailsDocumentsRequested) => this.requestKycMyRequestDetailsDocuments(kycMyRequestDetailsDocumentsRequested)));
        this.subscriptions.push(this.kycMyRequestDetailsDocumentsOb.subscribe(kycMyRequestDetailsDocuments => this.getKycMyRequestDetailsDocuments(kycMyRequestDetailsDocuments)));
    }

    requestKycMyRequestDetailsGeneral(kycMyRequestDetailsGeneralRequested): void {
        if (!kycMyRequestDetailsGeneralRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsGeneral(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsGeneral(kycMyRequestDetailsGeneral) {
        const listImu = fromJS(kycMyRequestDetailsGeneral);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsCompany(kycMyRequestDetailsCompanyRequested): void {
        if (!kycMyRequestDetailsCompanyRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsCompany(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsCompany(kycMyRequestDetailsCompany) {
        const listImu = fromJS(kycMyRequestDetailsCompany);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsCompanyBeneficiaries(kycMyRequestDetailsCompanyBeneficiariesRequested): void {
        if (!kycMyRequestDetailsCompanyBeneficiariesRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsCompanyBeneficiaries(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsCompanyBeneficiaries(kycMyRequestDetailsCompanyBeneficiaries) {
        const listImu = fromJS(kycMyRequestDetailsCompanyBeneficiaries);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsBanking(kycMyRequestDetailsBankingRequested): void {
        if (!kycMyRequestDetailsBankingRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsBanking(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsBanking(kycMyRequestDetailsBanking) {
        const listImu = fromJS(kycMyRequestDetailsBanking);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsClassification(kycMyRequestDetailsClassificationRequested): void {
        if (!kycMyRequestDetailsClassificationRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsClassification(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsClassification(kycMyRequestDetailsClassification) {
        const listImu = fromJS(kycMyRequestDetailsClassification);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsRisknature(kycMyRequestDetailsRisknatureRequested): void {
        if (!kycMyRequestDetailsRisknatureRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsRiskNature(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsRisknature(kycMyRequestDetailsRisknature) {
        const listImu = fromJS(kycMyRequestDetailsRisknature);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsRiskobjective(kycMyRequestDetailsRiskobjectiveRequested): void {
        if (!kycMyRequestDetailsRiskobjectiveRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsRiskObjectives(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsRiskobjective(kycMyRequestDetailsRiskobjective) {
        const listImu = fromJS(kycMyRequestDetailsRiskobjective);

        let myArray = [];
        myArray = listImu.reduce((result, item) => {

            result.push({
                // id: item.get('fundShareID'),
            });

            return result;
        }, []);

        this._changeDetectorRef.markForCheck();
    }

    requestKycMyRequestDetailsDocuments(kycMyRequestDetailsDocumentsRequested): void {
        if (!kycMyRequestDetailsDocumentsRequested) {
            OfiKycService.defaultRequestKycMyRequestDetailsDocuments(this._ofiKycService, this.ngRedux, this.kycID);
        }
    }

    getKycMyRequestDetailsDocuments(kycMyRequestDetailsDocuments) {
        const listImu = fromJS(kycMyRequestDetailsDocuments);

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