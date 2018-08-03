/* Core/Angular imports. */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { APP_CONFIG, AppConfig, ConfirmationService, mDateHelper } from '@setl/utils';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { MessagesService } from '@setl/core-messages';
import { ActivatedRoute } from '@angular/router';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import * as _ from 'lodash';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FileService } from '@setl/core-req-services';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Location } from '@angular/common';
import * as math from 'mathjs';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiFundAccessComponent implements OnDestroy, OnInit {

    appConfig: AppConfig;

    /* Public properties. */
    currentInvestor: any = {};
    investorData = {};
    tableData = [];
    access = {};
    changes = {
        add: false,
        remove: false
    };
    amCompany: string;
    kycId: number;
    investorWalletId: number;
    investorWalletData = {};

    investorForm: FormGroup;

    otherData = {};

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'requested']) requestedAmKycListObs;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requestedShare']) requestedAmAllFundShareListOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) amAllFundShareListOb;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _ofiKycService: OfiKycService,
                private _messagesService: MessagesService,
                private _route: ActivatedRoute,
                private _confirmationService: ConfirmationService,
                private _ofiFundShareService: OfiFundShareService,
                private _fb: FormBuilder,
                private _location: Location,
                private fileService: FileService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
        this.investorForm = this._fb.group({
            companyName: { value: '', disabled: true },
            clientReference: '',
            firstName: { value: '', disabled: true },
            lastName: { value: '', disabled: true },
            email: { value: '', disabled: true },
            phoneNumber: { value: '', disabled: true },
            approvalDateRequest: { value: '', disabled: true },
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.requestedAmKycListObs.subscribe((requested) => this.setAmKycListRequested(requested)));
        this.subscriptions.push(this.requestedAmKycListObs.subscribe(requested => {
            this.requestAllFundShareList(requested);
        }));

        this.subscriptions.push(
            observableCombineLatest(
                this.amKycListObs,
                this.amAllFundShareListOb,
            )
            .subscribe(([amKycList, fundShareList]) => {
                this.getAmKycList(amKycList, fundShareList);
            }),
        );

        // Get the parameter passed to URL
        this._route.params.subscribe((params) => {
            if (params.kycId) {
                this.kycId = Number(params.kycId);
            }
        });

        // test data.
        this.tableData = [];
        this.amCompany = '';
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }
    }

    saveClientReference() {
        const payload = {
            clientReference: this.investorForm.controls['clientReference'].value,
            invitedID: this.currentInvestor.invitedID,
        };
        this._ofiKycService.updateInvestor(payload)
        .then(() => {
            this.toasterService.pop('success', 'Client reference updated');
        })
        .catch(() => {
            this.toasterService.pop('success', 'Failed to update client reference');
        });
    }

    setAmKycListRequested(requested) {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this._ofiKycService, this._ngRedux);
        }
    }

    getAmKycList(amKycList, shareData) {
        let tempOtherData = {};
        if (amKycList.length > 0 && amKycList.findIndex((kyc) => kyc.kycID === this.kycId) !== -1) {
            const kyc = amKycList.filter((kyc) => kyc.kycID === this.kycId)[0];
            this.currentInvestor = kyc;
            const phoneNumber = (kyc.investorPhoneCode && kyc.investorPhoneNumber) ? `${kyc.investorPhoneCode} ${kyc.investorPhoneNumber}` : '';
            const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(kyc.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
            const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');


            this.investorData = {
                'kycID': kyc.kycID,
                'investorWalletID': kyc.investorWalletID,
                'companyName': kyc.investorCompanyName,
                'firstName': kyc.investorFirstName,
                'lastName': kyc.investorLastName,
                'email': kyc.investorEmail,
                'telephoneNumber': phoneNumber,
                'approvalDate': approvalDateRequest
            };

            this.investorForm.setValue({
                companyName: kyc.investorCompanyName,
                clientReference: kyc.clientReference,
                firstName: kyc.investorFirstName,
                lastName: kyc.investorLastName,
                email: kyc.investorEmail,
                phoneNumber: phoneNumber,
                approvalDateRequest: approvalDateRequest,
            });

            this.amCompany = kyc.companyName;
            this.investorWalletId = kyc.investorWalletID;

            tempOtherData['amCompany'] = this.amCompany;
            tempOtherData['investorData'] = this.investorData;

            this.otherData = tempOtherData;

            // Get the fund access for investor walletID and render it.
            this._ofiFundShareService.requestInvestorFundAccess({ investorWalletId: this.investorWalletId }).then((data) => {
                _.get(data, '[1].Data', []).forEach((row) => {
                    this.investorWalletData[row['shareID']] = row;
                });

                this.tableData = [];
                Object.keys(shareData).forEach((key) => {
                    this.tableData.push({
                        id: shareData[key]['fundShareID'],
                        kycId: this.kycId,
                        investorWalletID: this.investorWalletId,
                        accessChanged: false,
                        fundName: shareData[key]['fundName'],
                        shareName: shareData[key]['fundShareName'],
                        isin: shareData[key]['isin'],
                        max: ((1 + Math.min(shareData[key]['maxRedemptionFee'], shareData[key]['maxSubscriptionFee'])) * 100 - 100).toFixed(5),
                        minInvestment: shareData[key]['minSubsequentSubscriptionInAmount'],
                        access: !!this.investorWalletData[shareData[key]['fundShareID']],
                        entry: this.toFrontEndPercent((!!this.investorWalletData[shareData[key]['fundShareID']] ? this.investorWalletData[shareData[key]['fundShareID']]['entryFee'] : 0)),
                        exit: this.toFrontEndPercent((!!this.investorWalletData[shareData[key]['fundShareID']] ? this.investorWalletData[shareData[key]['fundShareID']]['exitFee'] : 0)),
                        override: (!!this.investorWalletData[shareData[key]['fundShareID']] ? (this.investorWalletData[shareData[key]['fundShareID']]['minInvestOverride'] == 1 ? 1 : 0) : false),
                        overrideAmount: (!!this.investorWalletData[shareData[key]['fundShareID']] ? this.investorWalletData[shareData[key]['fundShareID']]['minInvestVal'] : 0) / 100000,
                        overrideDocument: (!!this.investorWalletData[shareData[key]['fundShareID']] ? this.investorWalletData[shareData[key]['fundShareID']]['minInvestDocument'] : ''),
                        overrideDocumentTitle: (!!this.investorWalletData[shareData[key]['fundShareID']] ? this.investorWalletData[shareData[key]['fundShareID']]['fileTitle'] : ''),
                        newOverride: false,
                    });
                });

                this._changeDetectorRef.markForCheck();
            }).catch((e) => {

            });
        }
    }

    requestAllFundShareList(requested: boolean) {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
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

    back(): void {
        this._location.back();

        return;
    }
}
