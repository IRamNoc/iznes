import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil, filter as rxFilter, tap, map } from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute } from '@angular/router';
import { isEmpty, isNil, keyBy, filter, reduce, find } from 'lodash';
import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { RequestsService } from '../../requests.service';
import { NewRequestService } from '../new-request.service';
import { SelectAmcService } from './select-amc.service';

@Component({
    selector: 'kyc-step-select-amc',
    styleUrls: ['./select-amc.component.scss'],
    templateUrl: './select-amc.component.html'
})
export class NewKycSelectAmcComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<any> = new Subject();
    private kycList;
    private managementCompaniesExtract;

    managementCompanies: Array<any> = [];
    connectedWallet;

    preselectedManagementCompany: any = {};
    submitted = false;
    alreadyRegistered = false;

    @Input() form: FormGroup;
    @Input() set disabled(isDisabled){
        if(isDisabled){
            this.submitted = true;
        }
    }
    @Output() registered = new EventEmitter<boolean>();

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requestedKycList$;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'requested']) requestedManagementCompanyList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    constructor(
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private requestsService: RequestsService,
        private newRequestService: NewRequestService,
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
        private route: ActivatedRoute,
        private selectAmcService: SelectAmcService,
        private changeDetectorRef: ChangeDetectorRef,
    ) {
    }

    get filteredManagementCompanies() {
        const id = this.preselectedManagementCompany.id;

        if (id) {
            return filter(this.managementCompaniesExtract, company => {
                return company.id !== id;
            });
        }

        return this.managementCompaniesExtract;
    }

    get selectedManagementCompanies() {
        const selected = this.form.get('managementCompanies').value;

        return selected;
    }

    get isTableDisplayed(){
        return this.preselectedManagementCompany.id || this.selectedManagementCompanies.length
    }

    ngOnInit() {
        this.initSubscriptions();
        this.getAssetManagementCompanies();
        this.getQueryParams();
    }

    initSubscriptions() {
        this.requestedManagementCompanyList$
            .pipe(
                rxFilter(requested => !requested),
                takeUntil(this.unsubscribe),
            )
            .subscribe(() => {
                this.getAssetManagementCompanies();
            });

        let companyCombination$ = combineLatest(this.managementCompanyList$, this.myKycList$)
            .pipe(
                rxFilter(([managementCompanies, kycList]) => {
                    return managementCompanies && managementCompanies.size > 0;
                }),
                tap(([managementCompanies, kycList]) => {
                    this.managementCompanies = keyBy(managementCompanies.toJS(), 'companyID');
                    this.kycList = kycList;
                }),
                takeUntil(this.unsubscribe)
            );

        companyCombination$.subscribe(([managementCompanies, kycList]) => {
                const managementCompanyList = managementCompanies.toJS();

                this.managementCompaniesExtract = this.requestsService
                    .extractManagementCompanyData(managementCompanyList, kycList);
            });

        combineLatest(companyCombination$, this.requestedKycList$)
            .pipe(
                map(([company, kycs]) => kycs),
                rxFilter((kycs : Array<any>) => !!kycs.length),
                takeUntil(this.unsubscribe)
            )
            .subscribe(kycs => {
                this.populateForm(kycs);
            });

        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(connectedWallet => {
                this.connectedWallet = connectedWallet;
            });
    }

    populateForm(kycs){
        let formValue = kycs.map(kyc => {
            let foundKyc = find(this.kycList, ['kycID', kyc.kycID]);
            let alreadyCompleted = foundKyc ? foundKyc.alreadyCompleted : false;

            return {
                id : kyc.amcID,
                text : this.managementCompanies[kyc.amcID].companyName,
                registered : alreadyCompleted
            };
        });

        this.form.get('managementCompanies').setValue(formValue);
    }

    getQueryParams() {
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams.invitationToken) {
                this.preselectedManagementCompany = {
                    id: parseInt(queryParams.amcID, 10),
                    invitationToken: queryParams.invitationToken,
                    registered: false
                };
                this.disableValidators();
            }
        });
    }

    disableValidators() {
        const formControl = this.form.get('managementCompanies');
        formControl.clearValidators();
        formControl.updateValueAndValidity();
    }

    getAssetManagementCompanies() {
        this.ofiManagementCompanyService.fetchInvestorManagementCompanyList(true);
    }

    onRegisteredChange() {
        let accumulator = !isNil(this.preselectedManagementCompany.registered) ? 
            this.preselectedManagementCompany.registered : true;
        let selectedManagementCompanies = filter(this.selectedManagementCompanies, company => !isEmpty(company));

        let result = reduce(selectedManagementCompanies, (result, value) => {
            return result && value.registered;
        }, accumulator);

        this.alreadyRegistered = result;

        this.registered.emit(result);
    }

    async handleFormSubmit($event) {
        $event.preventDefault();

        if (!this.form.valid || this.submitted) {
            return;
        }

        let values = this.form.get('managementCompanies').value;

        if (this.preselectedManagementCompany.id) {
            values = values.concat([this.preselectedManagementCompany]);
        }
        let ids = await this.selectAmcService.createMultipleDrafts(values, this.connectedWallet);

        this.newRequestService.storeCurrentKycs(ids);

        this.ngRedux.dispatch(ClearMyKycListRequested());
        this.preselectedManagementCompany = {};
        this.submitted = true;
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
