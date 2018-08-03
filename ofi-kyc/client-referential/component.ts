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
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import * as math from 'mathjs';

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
    tableData = [];
    otherData = {};

    public subscriptions: Array<any> = [];

    clientReferential = [];
    clients = {};
    shareData = {};
    amKycList = [];

    companyName: string;

    investorTypes = [
        { id: 45, text: 'Institutional Investor' },
        { id: 55, text: 'Retail Investor' },
    ];

    @select(['ofi', 'ofiKyc', 'clientReferential', 'requested']) requestedOb;
    @select(['ofi', 'ofiKyc', 'clientReferential', 'clientReferential']) clientReferentialOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'requested']) requestedOfiKycListOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) amAllFundShareListOb;


    /* Constructor. */
    constructor(private _fb: FormBuilder,
                private _changeDetectorRef: ChangeDetectorRef,
                private _location: Location,
                private alertsService: AlertsService,
                private _ofiKycService: OfiKycService,
                private _toasterService: ToasterService,
                public _translate: MultilingualService,
                private _ofiFundShareService: OfiFundShareService,
                private _ofiKycObservablesService: OfiKycObservablesService,
                private _ngRedux: NgRedux<any>,
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

        this.subscriptions.push(this.amKycListObs.subscribe((amKycList) => {
            this.amKycList = amKycList;
        }));

        this.subscriptions.push(this.amAllFundShareListOb.subscribe((fundShareList) => {
            this.shareData = fundShareList;
        }));

        this.subscriptions.push(this.requestedOfiKycListOb.subscribe(
            (requested) => this.requestKycList(requested)));
    }

    requestSearch() {
        let investorType = (this.investorTypeForm.controls['investorType'].value.length > 0) ? this.investorTypeForm.controls['investorType'].value[0].id : -1;
        this._ofiKycService.defaultrequestgetclientreferential(investorType);
    }

    gotoInvite() {
        this.router.navigateByUrl('/invite-investors');
    }

    viewClient(id) {
        this.kycId = id;

        let tempOtherData = {};
        if (this.amKycList.length > 0 && this.amKycList.findIndex((kyc) => kyc.kycID === this.kycId) !== -1) {
            const kyc = this.amKycList.filter((kyc) => kyc.kycID === this.kycId)[0];

            this.companyName = kyc.investorCompanyName;

            tempOtherData['amCompany'] = kyc.companyName;
            tempOtherData['investorData'] = kyc.investorWalletID;
            this.otherData = tempOtherData;
            let investorWalletData = [];

            // Get the fund access for investor walletID and render it.
            this._ofiFundShareService.requestInvestorFundAccess({ investorWalletId: kyc.investorWalletID }).then((data) => {
                _.get(data, '[1].Data', []).forEach((row) => {
                    investorWalletData[row['shareID']] = row;
                });

                this.tableData = [];
                Object.keys(this.shareData).forEach((key) => {
                    this.tableData.push({
                        id: this.shareData[key]['fundShareID'],
                        kycId: this.kycId,
                        investorWalletID: kyc.investorWalletID,
                        accessChanged: false,
                        fundName: this.shareData[key]['fundName'],
                        shareName: this.shareData[key]['fundShareName'],
                        isin: this.shareData[key]['isin'],
                        max: ((1 + Math.min(this.shareData[key]['maxRedemptionFee'], this.shareData[key]['maxSubscriptionFee'])) * 100 - 100).toFixed(5),
                        minInvestment: this.shareData[key]['minSubsequentSubscriptionInAmount'],
                        access: !!investorWalletData[this.shareData[key]['fundShareID']],
                        entry: this.toFrontEndPercent((!!investorWalletData[this.shareData[key]['fundShareID']] ? investorWalletData[this.shareData[key]['fundShareID']]['entryFee'] : 0)),
                        exit: this.toFrontEndPercent((!!investorWalletData[this.shareData[key]['fundShareID']] ? investorWalletData[this.shareData[key]['fundShareID']]['exitFee'] : 0)),
                        override: (!!investorWalletData[this.shareData[key]['fundShareID']] ? (investorWalletData[this.shareData[key]['fundShareID']]['minInvestOverride'] == 1 ? 1 : 0) : false),
                        overrideAmount: (!!investorWalletData[this.shareData[key]['fundShareID']] ? investorWalletData[this.shareData[key]['fundShareID']]['minInvestVal'] : 0) / 100000,
                        overrideDocument: (!!investorWalletData[this.shareData[key]['fundShareID']] ? investorWalletData[this.shareData[key]['fundShareID']]['minInvestDocument'] : ''),
                        overrideDocumentTitle: (!!investorWalletData[this.shareData[key]['fundShareID']] ? investorWalletData[this.shareData[key]['fundShareID']]['fileTitle'] : ''),
                        newOverride: false,
                    });
                });

                this._changeDetectorRef.markForCheck();
            }).catch((e) => {

            });
        }
    }

    /**
     * convert blockchain scale (100000) to front-end number.
     * as we are show percentage we need to times it by 100.
     *
     * @param percent: the raw percentage number in blockchain scale.
     */
    toFrontEndPercent(percent: number): number {
        return this.roundDown(percent / 1000, 5);
    }

    /**
     * Round Down Numbers
     * eg 0.15151 becomes 0.151
     * eg 0.15250 becomes 0.152
     *
     * @param number
     * @param decimals
     * @returns {number}
     */
    roundDown(number: any, decimals: any) {
        decimals = decimals || 0;
        return math.format((Math.floor(number * Math.pow(10, decimals)) / Math.pow(10, decimals)), 14);
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestKycList(requested): void {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this._ofiKycService, this._ngRedux);
        }
    }

    ngOnDestroy() {
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }
    }

}
