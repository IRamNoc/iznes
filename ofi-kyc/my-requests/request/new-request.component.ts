import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NgRedux} from '@angular-redux/store';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {ClearMyKycListRequested} from '@ofi/ofi-main/ofi-store/ofi-kyc';

import {get as getValue} from 'lodash';

@Component({
    templateUrl: './new-request.component.html'
})
export class NewKycRequestComponent implements OnInit {

    stepsConfig: any;
    forms: any = {};
    preselectedManagementCompanyID;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>
    ) {
    }

    ngOnInit() {
        this.initForm();
        this.initFormSteps();
        this.getQueryParams();
    }

    getQueryParams() {
        this.route.queryParams.subscribe(queryParams => {
            if (queryParams.invitationToken) {
                this.createDraft(queryParams.invitationToken);
            }
        });
    }

    createDraft(invitationToken) {
        this.ofiKycService.createKYCDraft({
            inviteToken: invitationToken,
            managementCompanyID: 0,
            investorWalletID: 0
        }).then(response => {
            this.preselectedManagementCompanyID = getValue(response, [1, 'Data', 0, 'managementCompanyID']);
            this.ngRedux.dispatch(ClearMyKycListRequested());
        });
    }

    initForm() {
        let selectionForm = this.formBuilder.group({
            managementCompanies: [[], Validators.required]
        });

        this.forms.selection = selectionForm;
    }

    initFormSteps() {
        this.stepsConfig = [
            {
                title: 'Selection',
                form: this.forms.selection,
                id: 'step-selection'
            },
            {
                title: 'Introduction'
            }
        ];

    }


}