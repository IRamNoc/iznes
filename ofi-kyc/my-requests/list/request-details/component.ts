import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    Input
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import { fromJS } from 'immutable';
import { groupBy, find } from 'lodash';
import { NewRequestService } from '../../request/new-request.service';
import { Router } from '@angular/router';

import { MultilingualService } from '@setl/multilingual';
import { KycStatus as statusList } from '@ofi/ofi-main/ofi-kyc/my-requests/requests.service';

@Component({
    selector: 'my-requests-details',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyRequestsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input() kycID: number;

    kycList: Array<any>;
    statusList;

    disabledForm: FormGroup;

    requestDetailStatus = 'accepted';
    lastUpdate: string = 'YYYY-MM-DD 00:00:00';
    statusAuditItems = [];

    kycMessage = '';
    companyName: string = '';

    isKYCFull = true;

    private subscriptions: Array<any> = [];
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiKyc', 'statusAuditTrail', 'data']) statusAuditTrail$;

    constructor(
        private _fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private _ofiKycService: OfiKycService,
        private _toasterService: ToasterService,
        public _translate: MultilingualService,
        private ngRedux: NgRedux<any>,
        private newRequestService: NewRequestService,
        private router: Router,
    ) {
        this.statusList = statusList;
    }

    ngOnInit() {
        this.constructDisabledForm();
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.myKycList$
        .pipe(
            takeUntil(this.unSubscribe)
        )
        .subscribe(kycList => {
            this.kycList = kycList;
            const kyc = this.kycList.find((item) => item.kycID === this.kycID);
            if (kyc && typeof kyc !== 'undefined' && kyc !== undefined && kyc !== null) {
                this.requestDetailStatus = this.statusList[kyc.status];
                this.isKYCFull = (kyc.alreadyCompleted === 1 || kyc.status === 2) ? false : true;
                this.companyName = kyc.companyName;
                this.disabledForm.patchValue({
                    firstName: kyc.firstName,
                    lastName: kyc.lastName,
                    email: kyc.emailAddress,
                    phone: kyc.phoneNumber
                });
                this.lastUpdate = kyc.lastUpdated;
                this._ofiKycService.fetchStatusAuditByKycID(this.kycID);
            }
        })
        ;

        this.statusAuditTrail$
        .takeUntil(this.unSubscribe)
        .subscribe((d) => {
            if (!this.kycID || !Object.keys(d).length) {
                return;
            }

            if (d[this.kycID]) {
                if (d[this.kycID][0]) {
                    if (d[this.kycID][0].message) {
                        this.statusAuditItems = d[this.kycID][0].message;
                        this.disabledForm.get('rejectionMessage').patchValue(this.statusAuditItems, { emitEvent: false });
                        this.disabledForm.get('informationMessage').patchValue(this.statusAuditItems, { emitEvent: false });
                    }
                }
            }

            this._changeDetectorRef.markForCheck();
        })
        ;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            document.getElementById('blocStatus').style.opacity = '1';
            document.getElementById('blocStatus').style.marginTop = '0';
        }, 200);
    }

    constructDisabledForm() {
        this.disabledForm = this._fb.group({
            firstName: new FormControl({ value: 'first name', disabled: true }),
            lastName: new FormControl({ value: 'last name', disabled: true }),
            email: new FormControl({ value: 'email address', disabled: true }),
            phone: new FormControl({ value: 'phone number', disabled: true }),
            rejectionMessage: new FormControl({ value: 'No message', disabled: true }),
            informationMessage: new FormControl({ value: 'No message', disabled: true }),
        });
    }

    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();
    }

    redirectToRelatedKycs(kycID) {
        let currentKyc = find(this.kycList, ['kycID', kycID]);
        let completedStep = currentKyc.completedStep;
        let extras = {};

        let grouped = groupBy(this.kycList, 'currentGroup');
        let currentGroup = grouped[currentKyc.currentGroup];

        let kycIDs = [];
        currentGroup.forEach(kyc => {
            kycIDs.push({
                kycID: kyc.kycID,
                amcID: kyc.amManagementCompanyID,
                context: kyc.context,
                completedStep,
            });
        });

        if (completedStep) {
            extras = {
                queryParams: {
                    step: completedStep,
                    completed: currentGroup.reduce((acc, kyc) => acc && !!kyc.alreadyCompleted, true)
                }
            };
        }

        this.newRequestService.storeCurrentKycs(kycIDs);
        this._ofiKycService.notifyAMKycContinuedFromAskMoreInfo(kycID);
        this.router.navigate(['my-requests', 'new'], extras);
    }
}
