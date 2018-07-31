import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, AfterViewInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { select, NgRedux } from '@angular-redux/store';
import { Subscription, Subject } from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import { fromJS } from 'immutable';

import { MultilingualService } from '@setl/multilingual';
import {KycStatus as statusList} from '@ofi/ofi-main/ofi-kyc/my-requests/requests.service';

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
    ) {
        this.statusList = statusList;
    }

    ngOnInit() {
        if (this.kycID) {
            this._ofiKycService.fetchStatusAuditByKycID(this.kycID);
        }
        this.constructDisabledForm();
        this.initSubscriptions();
    }

    initSubscriptions() {
        this.statusAuditTrail$
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (!this.kycID || !Object.keys(d).length) {
                    return;
                }

                this.statusAuditItems = d[this.kycID].map(item => ({
                    oldStatus: item.oldStatus,
                    newStatus: item.newStatus,
                    modifiedBy: item.modifiedBy,
                    dateEntered: item.dateEntered,
                    message: item.message,
                }));

                if (this.statusAuditItems) {
                    if (this.statusAuditItems[0].message) {
                        this.disabledForm.get('rejectionMessage').patchValue(this.statusAuditItems[0].message, { emitEvent: false });
                        this.disabledForm.get('informationMessage').patchValue(this.statusAuditItems[0].message, { emitEvent: false });
                    }
                }

                this._changeDetectorRef.markForCheck();
            })
        ;

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
                    this.lastUpdate = kyc.lastUpdated;
                }
            })
        ;
    }

    ngAfterViewInit() {
        setTimeout(() => {
            document.getElementById('blocStatus').style.opacity = '1';
        }, 200);
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

    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();
    }
}
