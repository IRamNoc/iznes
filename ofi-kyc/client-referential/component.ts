import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { OfiKycObservablesService } from '../../ofi-req-services/ofi-kyc/kyc-observable';
import { immutableHelper } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import * as _ from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import * as math from 'mathjs';
import { FileDownloader, SagaHelper } from '@setl/utils';
import { OFI_SET_CLIENT_REFERENTIAL_AUDIT } from "@ofi/ofi-main/ofi-store";
import { mDateHelper } from "@setl/utils";
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Observable } from "rxjs/Rx";

@AppObservableHandler
@Component({
    selector: 'app-client-referential',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [OfiKycObservablesService],
})
export class OfiClientReferentialComponent implements OnInit, OnDestroy {
    searchForm: FormGroup;
    investorTypeForm: FormGroup;

    unSubscribe: Subject<any> = new Subject();

    pageType: string = 'list';
    kycId: string = '';
    tableData = [];
    otherData = {};

    public subscriptions: Array<any> = [];

    clientReferential = [];
    clients = {};
    shareData = {};
    amKycList = [];

    companyName: string;

    socketToken: string;
    userId: string;

    investorTypes = [
        { id: 0, text: 'All Investors' },
        { id: 45, text: 'Institutional Investor' },
        { id: 55, text: 'Retail Investor' },
    ];

    // Locale
    language = 'en';

    // Datepicker config
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
    };

    clientReferentialAudit = [];
    holdingsTable = [];
    investorKycIds = {};
    allKycIds = [];

    investorForm: FormGroup;
    currentInvestor: any = {};
    showInfo: boolean = false;

    @select(['ofi', 'ofiKyc', 'clientReferential', 'requested']) requestedOb;
    @select(['ofi', 'ofiKyc', 'clientReferential', 'clientReferential']) readonly clientReferentialOb: Observable<any[]>;
    @select(['ofi', 'ofiKyc', 'clientReferentialAudit', 'clientReferentialAudit']) clientReferentialAuditOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'requested']) requestedOfiKycListOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) amAllFundShareListOb;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userIdOb;

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
                private _fileDownloader: FileDownloader,
                private _route: ActivatedRoute,
                private router: Router) {

        this.investorTypeForm = new FormGroup({
            investorType: new FormControl(''),
        });

        this.searchForm = new FormGroup({
            searchInvestor: new FormControl(''),
            searchTo: new FormControl(''),
            searchFrom: new FormControl(''),
        });

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

    ngOnInit(): void {
        this._ofiKycService.setRequestedClientReferential(false);

        this.subscriptions.push(this.requestedOb.subscribe((requested) => {
            if (!requested) {
                this.requestSearch();
            }
        }));

        this.subscriptions.push(this.clientReferentialAuditOb.subscribe((clientReferentialAudit) => {
            this.clientReferentialAudit = clientReferentialAudit;
            this._changeDetectorRef.markForCheck();
        }));

        this.subscriptions.push(this.investorTypeForm.valueChanges.subscribe(() => {
            this._ofiKycService.setRequestedClientReferential(false);
        }));

        this.subscriptions.push(this.amAllFundShareListOb.subscribe((fundShareList) => {
            this.shareData = fundShareList;
        }));

        this.subscriptions.push(this.requestedOfiKycListOb.subscribe(
            (requested) => this.requestKycList(requested)));

        this.subscriptions.push(this.tokenOb.subscribe(token => {
            this.socketToken = token;
        }));

        this.subscriptions.push(this.userIdOb.subscribe(userId => {
            this.userId = userId;
        }));

        this.subscriptions.push(this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe((form) => {
            if (this.pageType == 'audit') this.requestAuditSearch();
        }));

        this.subscriptions.push(
            observableCombineLatest(
                this.clientReferentialOb,
                this.amKycListObs,
                this._route.params
            )
            .subscribe(([clientReferential, amKycList, params]) => {
                this.kycId = (params.kycId == 'list' ? '' : params.kycId);

                this.clientReferential = clientReferential;

                clientReferential.forEach((client) => {
                    this.clients[client.kycID] = client;
                });

                this.showInfo = false;
                if (!!this.clients[this.kycId] && this.clients[this.kycId].alreadyCompleted == 0) {
                    this.showInfo = true;
                }

                Object.keys(amKycList).forEach((key) => {
                    this.amKycList.push(amKycList[key]);
                    if (!this.investorKycIds[amKycList[key].investorUserID]) {
                        this.investorKycIds[amKycList[key].investorUserID] = [];
                    }
                    this.investorKycIds[amKycList[key].investorUserID].push(amKycList[key].kycID);
                    this.allKycIds.push(amKycList[key].kycID);

                    if (amKycList[key].kycID == this.kycId) this.currentInvestor = amKycList[key];
                });

                this.companyName = _.get(this.currentInvestor, 'investorCompanyName', '');

                if (this.kycId != '') {
                    const phoneNumber = (this.currentInvestor.investorPhoneCode && this.currentInvestor.investorPhoneNumber) ? `${this.currentInvestor.investorPhoneCode} ${this.currentInvestor.investorPhoneNumber}` : '';
                    const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(this.currentInvestor.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
                    const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');
                    this.investorForm.setValue({
                        companyName: this.currentInvestor.investorCompanyName,
                        clientReference: this.currentInvestor.clientReference,
                        firstName: this.currentInvestor.investorFirstName,
                        lastName: this.currentInvestor.investorLastName,
                        email: this.currentInvestor.investorEmail,
                        phoneNumber: phoneNumber,
                        approvalDateRequest: approvalDateRequest,
                    });
                }

                this._changeDetectorRef.markForCheck();
            }),
        );

    }

    requestSearch() {
        let investorType = (this.investorTypeForm.controls['investorType'].value.length > 0) ? this.investorTypeForm.controls['investorType'].value[0].id : -1;
        this._ofiKycService.defaultrequestgetclientreferential(investorType);
    }

    gotoInvite() {
        this.router.navigateByUrl('/invite-investors');
    }

    viewClient(id) {
        this.router.navigateByUrl('/client-referential/' + id);
    }

    loadTab(tab) {
        if (tab == 2) {

            let tempOtherData = {};
            if (this.amKycList.length > 0 && this.amKycList.findIndex((kyc) => kyc.kycID == this.kycId) !== -1) {
                const kyc = this.amKycList.filter((kyc) => kyc.kycID == this.kycId)[0];

                this.companyName = kyc.investorCompanyName;

                tempOtherData['amCompany'] = kyc.companyName;
                tempOtherData['investorData'] = {
                    firstName: kyc.investorFirstName,
                    companyName: kyc.investorCompanyName,
                    investorWalletID: kyc.investorWalletID
                };

                this.otherData = tempOtherData;
                let investorWalletData = [];

                // Get the fund access for investor walletID and render it.
                this._ofiFundShareService.requestInvestorFundAccess({ investorWalletId: kyc.investorWalletID }).then((data) => {
                    _.get(data, '[1].Data', []).forEach((row) => {
                        investorWalletData[row['shareID']] = row;
                    });

                    this.tableData = [];
                    Object.keys(this.shareData).forEach((key) => {
                        if (this.shareData[key].draft == 0) {
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
                        }
                    });

                    this._changeDetectorRef.markForCheck();
                }).catch((e) => {

                });
            }
        } else if (tab == 3) {

            if (this.amKycList.length > 0 && this.amKycList.findIndex((kyc) => kyc.kycID == this.kycId) !== -1) {
                const kyc = this.amKycList.filter((kyc) => kyc.kycID == this.kycId)[0];

                this.companyName = kyc.investorCompanyName;
            }

            this._ofiFundShareService.requestInvestorHoldings(this.kycId).then((data) => {
                this.holdingsTable = [];
                if (data[1].Data.length > 0) {
                    let tempArr = [];
                    let fundStats = {
                        fundName: '',
                        amount: 0,
                        ratio: 0
                    };
                    data[1].Data.forEach((row, index) => {
                        if (tempArr.length > 0 && fundStats['fundName'] != row.fundName) {
                            this.holdingsTable.push({
                                fundName: fundStats['fundName'],
                                fundCurrency: fundStats['fundCurrency'],
                                amount: fundStats['amount'],
                                ratio: fundStats['ratio']
                            });
                            fundStats = {
                                fundName: '',
                                amount: 0,
                                ratio: 0
                            };
                            this.holdingsTable = this.holdingsTable.concat(...tempArr);
                            tempArr = [];
                        }
                        fundStats['fundName'] = row.fundName;
                        fundStats['fundCurrency'] = row.fundCurrency;
                        fundStats['amount'] += row.amount;
                        fundStats['ratio'] += row.ratio;

                        tempArr.push(row);
                    });
                    this.holdingsTable.push({
                        fundName: fundStats['fundName'],
                        fundCurrency: fundStats['fundCurrency'],
                        amount: fundStats['amount'],
                        ratio: fundStats['ratio']
                    });
                    this.holdingsTable = this.holdingsTable.concat(...tempArr);
                }
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

    downloadReferentialCSVFile() {
        let investorType = (this.investorTypeForm.controls['investorType'].value.length > 0) ? this.investorTypeForm.controls['investorType'].value[0].id : -1;
        this._fileDownloader.downLoaderFile({
            method: 'getIznesReferentialCSVFile',
            token: this.socketToken,
            userId: this.userId,
            type: investorType
        });
    }

    requestAuditSearch() {
        let params = {
            id: this.kycId,
            search: this.searchForm.controls['searchInvestor'].value,
            from: this.searchForm.controls['searchFrom'].value,
            to: this.searchForm.controls['searchTo'].value,
        };

        const asyncTaskPipe = this._ofiKycService.requestAuditSearch(params);

        this._ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_CLIENT_REFERENTIAL_AUDIT],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    downloadReferentialAuditCSVFile() {
        this._fileDownloader.downLoaderFile({
            method: 'getIznesReferentialAuditCSVFile',
            token: this.socketToken,
            userId: this.userId,
            id: this.kycId,
            search: this.searchForm.controls['searchInvestor'].value,
            from: this.searchForm.controls['searchFrom'].value,
            to: this.searchForm.controls['searchTo'].value,
        });
    }

    downloadAllHoldingsCSVFile() {
        this._fileDownloader.downLoaderFile({
            method: 'exportClientReferentialClientsHoldings',
            token: this.socketToken,
            userId: this.userId,
            kycIds: this.allKycIds,
        });
    }

    downloadSingleHoldingsCSVFile() {
        this._fileDownloader.downLoaderFile({
            method: 'exportClientReferentialClientHoldings',
            token: this.socketToken,
            userId: this.userId,
            kycId: this.kycId,
        });
    }

    changePage(page) {
        if (page == this.pageType) {
            this.viewClient('list');
        } else {
            this.pageType = page;

            if (page == 'audit') this.requestAuditSearch();
        }
    }

    saveClientReference() {
        const payload = {
            clientReference: this.investorForm.controls['clientReference'].value,
            invitedID: this.currentInvestor.invitedID,
        };
        this._ofiKycService.updateInvestor(payload)
        .then(() => {
            this._toasterService.pop('success', 'Client reference updated');
        })
        .catch(() => {
            this._toasterService.pop('success', 'Failed to update client reference');
        });
    }

    ngOnDestroy() {
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }
    }

}
