import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { OfiKycObservablesService } from '../../ofi-req-services/ofi-kyc/kyc-observable';
import { immutableHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as moment from 'moment';
import * as _ from 'lodash';

import { investorInvitation } from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';

@AppObservableHandler
@Component({
    selector: 'app-client-referential',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [OfiKycObservablesService],
})
export class OfiClientReferentialComponent implements OnInit, OnDestroy {

    investorTypeForm: FormGroup;

    unSubscribe: Subject<any> = new Subject();

    kycId: string = 'list';

    public subscriptions: Array<any> = [];

    clientReferential = [];
    clients = {};

    investorTypes = [
        { id: 45, text: 'Institutional Investor' },
        { id: 55, text: 'Retail Investor' },
    ];

    @select(['ofi', 'ofiKyc', 'clientReferential', 'requested']) requestedOb;
    @select(['ofi', 'ofiKyc', 'clientReferential', 'clientReferential']) clientReferentialOb;

    /* Constructor. */
    constructor(private _fb: FormBuilder,
                private _changeDetectorRef: ChangeDetectorRef,
                private _location: Location,
                private alertsService: AlertsService,
                private _ofiKycService: OfiKycService,
                private _toasterService: ToasterService,
                public _translate: MultilingualService,
                private _ofiKycObservablesService: OfiKycObservablesService,
                private router: Router) {

        this.investorTypeForm = new FormGroup({
            investorType: new FormControl(''),
        });
    }

    ngOnInit(): void {
        this._ofiKycService.setRequestedClientReferential(false);

        this.subscriptions.push(this.requestedOb.subscribe((requested) => {
            if (!requested) {
                this.requestSearch();
            }
        }));

        this.subscriptions.push(this.clientReferentialOb.subscribe((clientReferential) => {
            this.clientReferential = clientReferential;

            clientReferential.forEach((client) => {
                this.clients[client.kycID] = client;
            });

            this._changeDetectorRef.markForCheck();
        }));

        this.subscriptions.push(this.investorTypeForm.valueChanges.subscribe(() => {
            this._ofiKycService.setRequestedClientReferential(false);
        }));
    }

    requestSearch() {
        let investorType = (this.investorTypeForm.controls['investorType'].value.length > 0) ? this.investorTypeForm.controls['investorType'].value[0].id : -1;
        this._ofiKycService.defaultrequestgetclientreferential(investorType);
    }

    gotoInvite() {
        this.router.navigateByUrl('/invite-investors');
    }

    ngOnDestroy() {
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }
    }

}
