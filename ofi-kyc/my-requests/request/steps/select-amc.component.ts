import {Component, OnInit, Input, OnDestroy, Output, EventEmitter, ChangeDetectorRef} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil, filter as rxFilter, tap, map} from 'rxjs/operators';
import {FormGroup} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {ActivatedRoute} from '@angular/router';
import {isEmpty, isNil, keyBy, filter, reduce} from 'lodash';

import {ClearMyKycListRequested} from '@ofi/ofi-main/ofi-store/ofi-kyc';
import {OfiManagementCompanyService} from "@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service";
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {RequestsService} from '../../requests.service';
import {NewRequestService} from '../new-request.service';
import {SelectAmcService} from './select-amc.service';

@Component({
    selector: 'kyc-step-select-amc',
    styleUrls: ['./select-amc.component.scss'],
    templateUrl: './select-amc.component.html'
})
export class NewKycSelectAmcComponent implements OnInit, OnDestroy {

    private unsubscribe: Subject<any> = new Subject();
    private kycList;
    private managementCompaniesExtract;

    managementCompanies;
    connectedWallet;

    preselectedManagementCompany: any = {};
    submitted = false;

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
        private changeDetectorRef: ChangeDetectorRef
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

        if (isEmpty(selected)) {
            return [{}];
        }
        return selected;
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
                    return !isEmpty(managementCompanies);
                }),
                tap(([managementCompanies, kycList]) => {
                    this.managementCompanies = keyBy(managementCompanies, 'companyID');
                }),
                takeUntil(this.unsubscribe)
            )
        ;

        companyCombination$.subscribe(([managementCompanies, kycList]) => {
                this.kycList = kycList;
                this.managementCompaniesExtract = this.requestsService
                    .extractManagementCompanyData(managementCompanies, kycList);
            })
        ;

        combineLatest(companyCombination$, this.requestedKycList$)
            .pipe(
                map(([company, kycs]) => kycs),
                rxFilter((kycs : Array<any>) => !!kycs.length),
                takeUntil(this.unsubscribe)
            )
            .subscribe(kycs => {
                this.populateForm(kycs);
            })
        ;

        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(connectedWallet => {
                this.connectedWallet = connectedWallet;
            })
        ;
    }

    populateForm(kycs){
        let formValue = kycs.map(kyc => {
            console.log('looking for', kyc.amcID);
            return {
                id : kyc.amcID,
                text : this.managementCompanies[kyc.amcID].companyName
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
        OfiManagementCompanyService.defaultRequestINVManagementCompanyList(
            this.ofiManagementCompanyService,
            this.ngRedux,
            true,
        );
    }

    onRegisteredChange() {
        let accumulator = !isNil(this.preselectedManagementCompany.registered) ? this.preselectedManagementCompany.registered : true;
        let selectedManagementCompanies = filter(this.selectedManagementCompanies, company => !isEmpty(company));

        let result = reduce(selectedManagementCompanies, (result, value) => {
            return result && value.registered;
        }, accumulator);

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

        this.submitted = true;
        this.changeDetectorRef.markForCheck();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
