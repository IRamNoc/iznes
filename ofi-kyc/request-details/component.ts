import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';

import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-request-details',
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiKycRequestDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    isDebug = true;

    disabledForm: FormGroup;

    private subscriptions: Array<any> = [];

    companyName: string = '';
    lastUpdate: string = 'YYYY-MM-DD 00:00:00';
    requestDetailStatus = 'accepted';
    isKYCFull = true;

    panelDefs = [];
    fakeDatas = [
        [
            'this is a test',
            'fake value',
        ],
        [
            'this is a test',
            'fake value',
        ],
        [
            'this is a test',
            'fake value',
        ],
        [
            'this is a test',
            'fake value',
        ],
    ];

    constructor(
        private _fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _ofiKycService: OfiKycService,
        private _toasterService: ToasterService,
        public _translate: MultilingualService,
        private redux: NgRedux<any>,
    ) {
        this.constructPanels();
        this.constructDisabledForm();
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
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-company-information',
                        title: 'Company Information',
                        open: false,
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-banking-information',
                        title: 'Banking Information',
                        open: false,
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-classification-confirmation',
                        title: 'Classification Confirmation',
                        open: false,
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
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
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-investments-objectives',
                        title: 'Investments\' Objectives',
                        open: false,
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
                        data: this.fakeDatas,
                    },
                    {
                        id: 'request-details-investments-constraints',
                        title: 'Investments\' Constraints',
                        open: false,
                        columns: [
                            {
                                label: 'Information',
                            },
                            {
                                label: 'Value',
                            },
                        ],
                        data: this.fakeDatas,
                    },
                ]
            },
            {
                id: 'request-details-documents',
                title: 'Documents',
                open: false,
                columns: [
                    {
                        label: 'Information',
                    },
                    {
                        label: 'Value',
                    },
                ],
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

    ngOnInit() {

    }

    ngAfterViewInit() {
        setTimeout(() => {
            document.getElementById('blocStatus').style.opacity = '1';
        }, 1500);
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