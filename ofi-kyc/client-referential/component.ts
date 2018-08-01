import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { OfiKycObservablesService } from '../../ofi-req-services/ofi-kyc/kyc-observable';
import { immutableHelper } from '@setl/utils';
import { NgRedux } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

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

    kycId: string;

    listView: boolean = true;

    investorTypes = [
        { id: -1, text: 'All Investors' },
        { id: 45, text: 'Institutional Investor' },
        { id: 55, text: 'Retail Investor' },
    ];

    /* Constructor. */
    constructor(private _fb: FormBuilder,
                private _changeDetectorRef: ChangeDetectorRef,
                private _location: Location,
                private alertsService: AlertsService,
                private _ofiKycService: OfiKycService,
                private _toasterService: ToasterService,
                public _translate: MultilingualService,
                private _ofiKycObservablesService: OfiKycObservablesService,
                private router: Router,
                private _route: ActivatedRoute,
                private redux: NgRedux<any>) {

        this.investorTypeForm = new FormGroup({
            investorType: new FormControl(''),
        });
    }

    ngOnInit(): void {
        // Get the parameter passed to URL
        this._route.params.subscribe((params) => {
            this.kycId = params.kycID;

            if (this.kycId == 'list') {
                //list view
                this.listView = true;
            } else {
                //tabs view

                //before this loads need to go check if they have access to this.

                this.listView = false;
            }

            console.log('listView', this.listView);

        });
    }

    example() {     //remove this later.
        this.router.navigateByUrl('/client-referential/3');
    }

    gotoInvite() {
        this.router.navigateByUrl('/invite-investors');
    }

    ngOnDestroy() {

    }
}
