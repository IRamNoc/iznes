import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    AfterViewInit,
    Input,
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
import { convertUtcStrToLocalStr } from '@setl/utils/helper/m-date-wrapper/index';
import { KycStatus as statusList } from '@ofi/ofi-main/ofi-kyc/my-requests/requests.service';

@Component({
    selector: 'my-requests-details',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class MyRequestsDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() kycID: number;

    kycList: any[];
    statusList;

    disabledForm: FormGroup;

    requestDetailStatus = 'accepted';
    lastUpdate: string = 'YYYY-MM-DD 00:00:00';
    statusAuditItems = [];

    kycMessage = '';
    companyName: string = '';

    isKYCFull = true;
    isClientFile;

    private subscriptions: any[] = [];
    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiKyc', 'statusAuditTrail', 'data']) statusAuditTrail$;

    constructor(
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private alertsService: AlertsService,
        private ofiKycService: OfiKycService,
        private toasterService: ToasterService,
        public translate: MultilingualService,
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

    ngAfterViewInit() {
        setTimeout(
            () => {
                document.getElementById('blocStatus').style.opacity = '1';
                document.getElementById('blocStatus').style.marginTop = '0';
            },
            200);
    }

    initSubscriptions() {
        this.myKycList$
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((kycList) => {
            this.kycList = kycList;
            const kyc = this.kycList.find(item => item.kycID === this.kycID);
            if (kyc && typeof kyc !== 'undefined' && kyc !== undefined && kyc !== null) {
                this.requestDetailStatus = this.statusList[kyc.status];
                this.isKYCFull = (!(kyc.alreadyCompleted === 1 || kyc.status === 2));
                this.companyName = kyc.companyName;
                this.disabledForm.patchValue({
                    firstName: kyc.firstName,
                    lastName: kyc.lastName,
                    email: kyc.emailAddress,
                    phone: kyc.phoneNumber,
                });
                this.lastUpdate = convertUtcStrToLocalStr(kyc.lastUpdated, 'YYYY-MM-DD HH:mm:SS');
                this.ofiKycService.fetchStatusAuditByKycID(this.kycID);
                this.isClientFile = kyc.amManagementCompanyID === null;
            }
        });

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

            this.changeDetectorRef.markForCheck();
        });
    }

    constructDisabledForm() {
        this.disabledForm = this.fb.group({
            firstName: new FormControl({ value: 'first name', disabled: true }),
            lastName: new FormControl({ value: 'last name', disabled: true }),
            email: new FormControl({ value: 'email address', disabled: true }),
            phone: new FormControl({ value: 'phone number', disabled: true }),
            rejectionMessage: new FormControl({ value: 'No message', disabled: true }),
            informationMessage: new FormControl({ value: 'No message', disabled: true }),
        });
    }

    redirectToRelatedKycs(kycID, overrideCompleteStep: string) {
        const currentKyc = find(this.kycList, ['kycID', kycID]);
        const completedStep = overrideCompleteStep || currentKyc.completedStep;
        let extras = {};

        const grouped = groupBy(this.kycList, 'currentGroup');
        const currentGroup = grouped[currentKyc.currentGroup];

        const kycIDs = [];
        currentGroup.forEach((kyc) => {
            kycIDs.push({
                kycID: kyc.kycID,
                amcID: kyc.amManagementCompanyID,
                context: kyc.context,
                completedStep,
                isThirdPartyKyc: kyc.isThirdPartyKyc,
                managementCompanyType: kyc.managementCompanyType,
            });
        });

        if (completedStep) {
            extras = {
                queryParams: {
                    step: completedStep,
                    completed: currentGroup.reduce((acc, kyc) => acc && !!kyc.alreadyCompleted, true),
                },
            };
        }

        this.newRequestService.storeCurrentKycs(kycIDs);
        this.ofiKycService.notifyAMKycContinuedFromAskMoreInfo(kycID);
        this.router.navigate(['onboarding-requests', 'new'], extras);
    }

    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (const key of this.subscriptions) {
            key.unsubscribe();
        }

        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();
    }
}
