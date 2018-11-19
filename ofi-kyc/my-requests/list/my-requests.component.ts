import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NgRedux, select } from '@angular-redux/store';
import { findIndex } from 'lodash';
import { clearMyKycRequestedIds } from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-request/actions';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import {
    ClearMyKycListRequested,
    SetMyKycOpenTab,
    ClearMyKycOpenTab,
    SetMyKycOpenTabActive,
} from '@ofi/ofi-main/ofi-store/ofi-kyc/kyc-list/actions';

@Component({
    styleUrls: ['./my-requests.component.scss'],
    templateUrl: './my-requests.component.html',
})
export class MyRequestsComponent implements OnInit, OnDestroy {
    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiKyc', 'myKycList', 'tabs']) openTabs$;

    isListDisplayed;
    kycList: any[];
    subscriptions: Subscription[] = [];
    tabs: any[] = [];

    newRequestModal: boolean = false;
    kycListSelect: any[] = [];
    choices: FormGroup;

    private unsubscribe: Subject<any> = new Subject();

    constructor(
        private ngRedux: NgRedux<any>,
        private router: Router,
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private ofiManagementCompanyService: OfiManagementCompanyService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.initForm();
        this.getAssetManagementCompanies();

        this.ngRedux.dispatch(clearMyKycRequestedIds());
        this.ngRedux.dispatch(ClearMyKycListRequested());
    }

    initForm() {
        this.choices = this.fb.group({
            choice: this.fb.control('duplicate'),
            selected: this.fb.control(null, Validators.required),
        });
    }

    initSubscriptions() {
        this.myKycList$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((kycList) => {
            this.kycList = kycList;

            this.kycListSelect = kycList.filter(kyc => kyc.status && !kyc.alreadyCompleted).map(kyc => ({
                id: kyc.kycID,
                text: kyc.companyName,
            }));
        });

        this.openTabs$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((openTabs) => {
            this.tabs = openTabs;
        });
    }

    getAssetManagementCompanies() {
        this.ofiManagementCompanyService.fetchInvestorManagementCompanyList(true);
    }

    selectedKyc(kyc) {
        const kycID = kyc.kycID;
        const index = findIndex(this.tabs, ['kycID', kycID]);
        let action;

        if (index !== -1) {
            action = SetMyKycOpenTabActive(index);
            this.ngRedux.dispatch(action);
        } else {
            action = SetMyKycOpenTab(
                {
                    kycID,
                    companyName: kyc.companyName,
                    displayed: true,
                },
            );
            this.ngRedux.dispatch(action);
        }
    }

    handleConfirm() {
        const choice = this.choices.get('choice').value;
        const selectedControl = this.choices.get('selected');

        if (choice === 'duplicate' && !this.choices.valid) {
            selectedControl.markAsTouched();
            return;
        }

        const navigationExtras: any = {
            relativeTo: this.route,
        };

        if (choice === 'duplicate') {
            const kycToDuplicate = selectedControl.value[0].id;

            navigationExtras.queryParams = {
                duplicate: kycToDuplicate,
            };
        }

        this.router.navigate(['../', 'new'], navigationExtras);
    }

    hasError() {
        const choice = this.choices.get('choice').value;
        const selectedControl = this.choices.get('selected');

        if (choice === 'duplicate' && selectedControl.touched && !selectedControl.valid) {
            return true;
        }
    }

    closeTab(index) {
        const action = ClearMyKycOpenTab(index);
        this.ngRedux.dispatch(action);

        this.isListDisplayed = true;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
