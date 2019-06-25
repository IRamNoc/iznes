import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Subject } from 'rxjs';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { NgRedux, select } from '@angular-redux/store';
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
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList']) invManagementCompanies$;

    isListDisplayed;
    kycList: any[];
    clientFileKyc: {kycID: number; companyName: string; status: number};
    invManagementCompanies: any[];
    subscriptions: Subscription[] = [];
    tabs: any[] = [];

    newRequestModal: boolean = false;
    kycListSelect: any[] = [];
    choices: FormGroup;

    private unsubscribe: Subject<any> = new Subject();
    private companyRequestedIds: number[];
    private companyIds: number[];

    get clientFileValidated() {
        return this.clientFileKyc.status === -1;
    }

    get  clientFileRejected() {
        if (this.clientFileKyc) {
            return this.clientFileKyc.status === -2;
        } else {
            return false;
        }
    }

    get clientFileStatusIcon(): string {
        const status = this.clientFileKyc && this.clientFileKyc.status;

        if (!status) {
            return '';
        }

        return {
            '-1': 'success-standard',
            '1': 'clock',
            '2': 'info-standard',
            '-2': 'error-standard',
        }[status];
    }

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
            this.kycList = kycList.filter(kyc => kyc.amManagementCompanyID !== null);

            this.clientFileKyc = kycList.filter(kyc => kyc.amManagementCompanyID === null)[0];

            if (kycList != undefined) this.getRequestedManagementCompanyIds();

            this.kycListSelect = kycList.filter(kyc => kyc.status && !kyc.alreadyCompleted).map(kyc => ({
                id: kyc.kycID,
                text: kyc.companyName,
            }));

            // if user come from finished nowcp onboard. create duplicate from client file programmatically.
            if (this.isFromNowCpOnboard()) {
               this.duplicateFromClientFile();
            }

        });

        this.openTabs$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((openTabs) => {
            this.tabs = openTabs;
        });

        this.invManagementCompanies$
        .pipe(
            takeUntil(this.unsubscribe),
        )
        .subscribe((companies) => {
            this.invManagementCompanies = companies.investorManagementCompanyList;

            if (companies != undefined) this.getInvManagementCompanyIds();
        });
    }

    private getInvManagementCompanyIds(): void {
        this.companyIds = [];

        this.invManagementCompanies.forEach((company) => {
            this.companyIds.push(company.get('companyID'));
        });
    }

    private getRequestedManagementCompanyIds(): void {
        this.companyRequestedIds = [];

        this.kycList.forEach((kyc) => {
            this.companyRequestedIds.push(kyc.amManagementCompanyID);
        });
    }

    hasCompaniesToRequest(): boolean {
        if(_.isEqual(this.companyIds.sort(), this.companyRequestedIds.sort())) return false;

        return true;
    }

    getAssetManagementCompanies() {
        this.ofiManagementCompanyService.fetchInvestorManagementCompanyList(true);
    }

    selectedKyc(kyc) {
        const kycID = kyc.kycID;
        const index = _.findIndex(this.tabs, ['kycID', kycID]);
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
                    isClientFile: kyc.amManagementCompanyID === null,
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

    duplicateFromClientFile(){
        const navigationExtras: any = {
            relativeTo: this.route,
        };

        navigationExtras.queryParams = {
            duplicate: this.clientFileKyc.kycID,
            isclientfile: true,
        };

        this.router.navigate(['../', 'new'], navigationExtras);
    }

    hasError() {
        const choice = this.choices.get('choice').value;
        const selectedControl = this.choices.get('selected');

        if (choice === 'duplicate' && selectedControl.touched && !selectedControl.valid) {
            return true;
        }
    }

    isFromNowCpOnboard() {
        return this.router.url.match('/onboarding-requests/onboard-iznes');
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
