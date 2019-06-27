import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { isEmpty, castArray, find, pick } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter as rxFilter, map, takeUntil, take, tap } from 'rxjs/operators';
import { List } from 'immutable';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RiskProfileService } from '../risk-profile.service';
import { NewRequestService } from '../../new-request.service';

@Component({
    selector: 'investment-nature-form',
    templateUrl: './investment-nature-form.component.html',
    styleUrls: ['./investment-nature-form.component.scss'],
})
export class InvestmentNatureFormComponent implements OnInit {
    @Output() refreshForm = new EventEmitter<void>();
    @Input() form;
    @Input() multiple;
    @Input() index;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = true;
    investmentVehicleList;
    frequencyList;
    amc = {
        companyID: '',
        companyName: '',
    };

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
    ) {
    }

    ngOnInit() {
        this.initData();
        this.initFormCheck();
        this.getCurrentFormData();
    }

    initData() {
        this.managementCompanyList$
        .pipe(
            rxFilter((managementCompanyList: List<any>) => managementCompanyList && managementCompanyList.size > 0),
            takeUntil(this.unsubscribe),
        )
        .subscribe((amcList) => {
            const managementCompanyList = amcList.toJS();
            const amcID = this.form.get('assetManagementCompanyID').value;

            if (amcID) {
                const found = find(managementCompanyList, ['companyID', amcID]);

                if (found) {
                    this.amc = found;
                }
            }
        });

        this.investmentVehicleList = this.newRequestService.investmentVehiclesList;
        this.frequencyList = this.newRequestService.frequencyList;
    }

    initFormCheck() {
        this.form.get('investmentvehiclesAlreadyUsed').valueChanges.subscribe((investmentvehiclesAlreadyUsed) => {
            this.formCheckInvestmentVehicles(investmentvehiclesAlreadyUsed);
        });
    }

    formCheckInvestmentVehicles(value) {
        const control: AbstractControl = this.form.get('investmentvehiclesAlreadyUsedSpecification');

        if (value.other) {
            control.enable();
        } else {
            control.disable();
        }

        this.refreshForm.emit();
    }

    getCurrentFormData() {
        this.riskProfileService.currentServerData.risknature
        .pipe(
            rxFilter((data: any) => !isEmpty(data)),
            rxFilter((data: any) => {
                const currentAMCId = this.form.get('assetManagementCompanyID').value;
                const dataAMCId = data.assetManagementCompanyID;

                return !this.multiple || (dataAMCId === currentAMCId);
            }),
            take(1),
        )
        .subscribe((data: any) => {
            this.form.patchValue(data);
        });
    }

    hasError(control, error = []) {
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        const control = this.form.get(path);
        return control.disabled;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
