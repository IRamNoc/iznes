import {Component, OnInit, Input, OnDestroy, Output, EventEmitter} from '@angular/core';
import {combineLatest, Subject} from 'rxjs';
import {takeUntil, filter as rxFilter} from 'rxjs/operators';
import { FormGroup } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { ActivatedRoute } from '@angular/router';
import {isEmpty, isNil, keyBy, filter, reduce} from 'lodash';

import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { OfiManagementCompanyService } from "@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service";
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { RequestsService } from '../../requests.service';
import {NewRequestService} from '../new-request.service';
import {SelectAmcService} from './select-amc.service';

@Component({
    selector: 'kyc-step-select-amc',
    styleUrls: ['./select-amc.component.scss'],
    templateUrl: './select-amc.component.html'
})
export class NewKycSelectAmcComponent implements OnInit, OnDestroy {

    private unsubscribe: Subject<any> = new Subject();
    private managementCompanies;
    private kycList;
    private managementCompaniesExtract;

    connectedWallet;

    preselectedManagementCompany: any = {};

    get filteredManagementCompanies() {
        const id = this.preselectedManagementCompany.id;

        if (id) {
            return filter(this.managementCompaniesExtract, company => {
                return company.id !== id;
            });
        }

        return this.managementCompaniesExtract;
    }

    @Input() form: FormGroup;
    @Output() registered = new EventEmitter<boolean>();

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
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
        private selectAmcService: SelectAmcService
    ) {
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

        combineLatest(this.managementCompanyList$, this.myKycList$)
            .pipe(
                filter(([managementCompanies, kycList]) => {
                    return managementCompanies && kycList;
                }),
                takeUntil(this.unsubscribe)
            )
            .subscribe(([managementCompanies, kycList]) => {
                this.managementCompanies = keyBy(managementCompanies, 'companyID');
                this.kycList = kycList;
                this.managementCompaniesExtract = this.requestsService
                    .extractManagementCompanyData(managementCompanies, kycList);
            })
        ;

        this.connectedWallet$
            .pipe(
                takeUntil(this.unsubscribe)
            )
            .subscribe(connectedWallet => {
                this.connectedWallet = connectedWallet;
            });
    }

    getQueryParams() {
        this.route.queryParams.subscribe(queryParams => {

            if (queryParams.invitationToken) {
                this.preselectedManagementCompany = {
                    id: parseInt(queryParams.amcID, 10),
                    invitationToken: queryParams.invitationToken,
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
        let accumulator = this.preselectedManagementCompany ? this.preselectedManagementCompany.registered : false;

        let result = reduce(this.selectedManagementCompanies, (result, value) => {
            return result && value.registered;
        }, accumulator);

        this.registered.emit(result);
    }

    async handleFormSubmit($event) {
        $event.preventDefault();

        if (!this.form.valid) {
            return;
        }

        let values = this.form.get('managementCompanies').value;

        if (this.preselectedManagementCompany.id) {
            values = values.concat([this.preselectedManagementCompany]);
        }

        let ids = await this.selectAmcService.createMultipleDrafts(values, this.connectedWallet);

        this.newRequestService.storeCurrentKycs(ids);

        this.ngRedux.dispatch(ClearMyKycListRequested());
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
