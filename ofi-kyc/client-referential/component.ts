import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { OfiKycObservablesService } from '../../ofi-req-services/ofi-kyc/kyc-observable';
import { FileDownloader, SagaHelper, mDateHelper, NumberConverterService } from '@setl/utils';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operators';
import { combineLatest as observableCombineLatest } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { get, isEmpty } from 'lodash';
import { MultilingualService } from '@setl/multilingual';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import * as math from 'mathjs';
import { OFI_SET_CLIENT_REFERENTIAL_AUDIT } from '@ofi/ofi-main/ofi-store';
import * as moment from 'moment-timezone';
import { Location } from '@angular/common';
import { PortfolioManagerDetail } from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/model';
import { InvestorType, isRetail, isMandate, isPortfolioManager } from '../../shared/investor-types';
import { PermissionsService } from '@setl/utils/services/permissions';

const values = (o: object) => Object.keys(o).map(i => o[i]);

@AppObservableHandler
@Component({
    selector: 'app-client-referential',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
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
    loading = true;
    currentTab = 1;

    public hasPermissionClientReferentialUpdate: boolean = false;
    public hasPermissionInvestorInvitation: boolean = false;

    public subscriptions: Array<any> = [];

    clientReferential = [];
    clients = {};
    shareData = {};
    amKycList = [];

    companyName: string;
    pmIdentifier = '';

    socketToken: string;
    userId: string;

    investorTypes = [];

    // Locale
    language = 'en';

    // Datepicker config
    fromConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.searchForm.controls['searchTo'].value != '') {
                return (thisDate.diff(this.searchForm.controls['searchTo'].value) > 0);
            }
            return false;
        },
    };

    toConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.searchForm.controls['searchFrom'].value != '') {
                return (thisDate.diff(this.searchForm.controls['searchFrom'].value) < 0);
            }
            return false;
        },
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
    @select(['ofi', 'ofiPortfolioManager', 'portfolioManagerList', 'portfolioManagerList']) portfolioManagers$: Observable<PortfolioManagerDetail[]>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) amAllFundShareListOb;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail', 'userId']) userIdOb;
    @select(['user', 'siteSettings', 'language']) requestLanguageOb;

    /* Constructor. */
    constructor(private fb: FormBuilder,
                private changeDetectorRef: ChangeDetectorRef,
                private ofiKycService: OfiKycService,
                private toasterService: ToasterService,
                private ofiFundShareService: OfiFundShareService,
                private ngRedux: NgRedux<any>,
                private fileDownloader: FileDownloader,
                private route: ActivatedRoute,
                private router: Router,
                public translate: MultilingualService,
                private location: Location,
                private numberConverterService: NumberConverterService,
                public permissionsService: PermissionsService,
    ) { }

    ngOnInit(): void {
        this.permissionsService.hasPermission('manageClientReferential', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionClientReferentialUpdate = hasPermission;
            },
        );

        this.permissionsService.hasPermission('investorInvitation', 'canRead').then(
            (hasPermission) => {
                this.hasPermissionInvestorInvitation = hasPermission;
            },
        );

        this.investorTypeForm = new FormGroup({
            investorType: new FormControl(''),
        });

        this.searchForm = new FormGroup({
            searchInvestor: new FormControl(''),
            searchTo: new FormControl(''),
            searchFrom: new FormControl(''),
        });

        this.investorForm = this.fb.group({
            companyName: { value: '', disabled: true },
            clientReference: '',
            firstName: { value: '', disabled: true },
            lastName: { value: '', disabled: true },
            email: { value: '', disabled: true },
            phoneNumber: { value: '', disabled: true },
            approvalDateRequest: { value: '', disabled: true },
        });

        this.ofiKycService.setRequestedClientReferential(false);

        this.initInvestorTypes();

        this.subscriptions.push(this.requestedOb.subscribe((requested) => {
            if (!requested) {
                this.requestSearch();
            }
        }));

        this.subscriptions.push(this.clientReferentialAuditOb.subscribe((clientReferentialAudit) => {
            this.clientReferentialAudit = clientReferentialAudit;
            this.changeDetectorRef.markForCheck();
        }));

        this.subscriptions.push(this.investorTypeForm.valueChanges.subscribe(() => {
            this.ofiKycService.setRequestedClientReferential(false);
        }));

        this.subscriptions.push(this.amAllFundShareListOb.subscribe((fundShareList) => {
            this.shareData = fundShareList;
        }));

        this.subscriptions.push(this.requestedOfiKycListOb.subscribe(
            requested => this.requestKycList(requested)));

        this.subscriptions.push(this.tokenOb.subscribe((token) => {
            this.socketToken = token;
        }));

        this.subscriptions.push(this.userIdOb.subscribe((userId) => {
            this.userId = userId;
        }));

        this.subscriptions.push(this.requestLanguageOb.subscribe(() => {
            this.initInvestorTypes();
        }));

        this.subscriptions.push(this.searchForm.valueChanges.pipe(debounceTime(500)).subscribe((form) => {
            if (this.pageType == 'audit') this.requestAuditSearch();
        }));

        const LANG_INSTITUTIONAL = this.translate.translate('Institutional');
        const LANG_RETAIL = this.translate.translate('Retail');
        const LANG_DIRECT = this.translate.translate('In Direct');
        const LANG_MANDATE = this.translate.translate('By Mandate');

        const typeMap = {
            '10': LANG_INSTITUTIONAL,
            // '20': LANG_INSTITUTIONAL,
            '30': LANG_RETAIL,
            '40': LANG_INSTITUTIONAL,
            // '50': LANG_INSTITUTIONAL,
            '60': LANG_RETAIL,
        };
        const methodMap = {
            'direct': LANG_DIRECT,
            'mandate': LANG_MANDATE,
        };

        this.subscriptions.push(
            observableCombineLatest(
                this.clientReferentialOb,
                this.amKycListObs,
                this.portfolioManagers$,
                this.route.params,
                this.route.queryParams,
            )
                .subscribe(([clientReferential, amKycList, portfolioManagers, params, query]) => {
                    this.kycId = (!params.kycId ? '' : params.kycId);

                    if (!this.kycId) this.companyName = this.translate.translate('All Clients');

                    this.clientReferential = clientReferential.map((client) => {
                        return {
                            ...client,
                            investorName: (isRetail(client.investorType)) ? `${client.firstName} ${client.lastName}` : client.companyName,
                            investorType: typeMap[client.investorType],
                            investmentMethod: methodMap[client.investmentMethod],
                        };
                    });

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

                    switch (this.currentInvestor.investorType) {
                        case InvestorType.FundOfFundsManager:
                            this.companyName = this.currentInvestor.fundName;
                            this.loadTab(2);
                        break;
                        case InvestorType.DiscretionaryManager:
                            console.log('Discretionary manager');
                        break;
                        case InvestorType.InstitutionalMandate:
                            this.companyName = this.currentInvestor.investorCompanyName;
                            this.investorForm.patchValue({
                                companyName: this.currentInvestor.investorCompanyName || '',
                                clientReference: this.currentInvestor.clientReference,
                            });
                        break;
                        case InvestorType.RetailMandate:
                            this.companyName = `${this.currentInvestor.investorFirstName} ${this.currentInvestor.investorLastName}`;
                            this.investorForm.patchValue({
                                firstName: this.currentInvestor.investorFirstName || '',
                                lastName: this.currentInvestor.investorLastName || '',
                                clientReference: this.currentInvestor.clientReference,
                            });
                        break;
                        default:
                            if (isEmpty(this.currentInvestor)) {
                                break;
                            }
                            if (isRetail(this.currentInvestor.investorType)) {
                                this.companyName = `${this.currentInvestor.investorFirstName} ${this.currentInvestor.investorLastName}`;
                            } else {
                                this.companyName = get(this.currentInvestor, 'investorCompanyName', '');
                            }
                            if (!this.companyName) {
                                this.companyName = get(this.currentInvestor, 'investorEmail', '');
                            }
                            if (this.kycId != '') {
                                const phoneNumber = (this.currentInvestor.investorPhoneCode && this.currentInvestor.investorPhoneNumber) ? `${this.currentInvestor.investorPhoneCode} ${this.currentInvestor.investorPhoneNumber}` : '';
                                const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(this.currentInvestor.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
                                const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');
                                this.investorForm.setValue({
                                    companyName: this.currentInvestor.investorCompanyName || '',
                                    clientReference: this.currentInvestor.clientReference,
                                    firstName: this.currentInvestor.investorFirstName || '',
                                    lastName: this.currentInvestor.investorLastName || '',
                                    email: this.currentInvestor.investorEmail,
                                    phoneNumber,
                                    approvalDateRequest,
                                });
                            }
                        break;
                    }
                    if (query.tab) {
                        this.loadTab(+query.tab);
                    }
                    this.loading = false;
                    this.changeDetectorRef.markForCheck();
                }),
        );
    }

    initInvestorTypes() {
        this.investorTypes = this.translate.translate([
            { id: 0, text: 'All Investors' },
            { id: 10, text: 'Institutional Investor' },
            { id: 30, text: 'Retail Investor' },
        ]);
    }

    getClientReferentialDescriptionTitle(): string {
        const companyName = this.companyName || '';
        const reference = get(this.clients, [this.kycId, 'clientReference'], '') || '';
        return (reference && companyName) ? `: ${companyName}: ${reference}` : (!reference) ? `: ${companyName}` : `: ${reference}`;
    }

    requestSearch() {
        const investorType = (this.investorTypeForm.controls['investorType'].value.length > 0) ? this.investorTypeForm.controls['investorType'].value[0].id : -1;
        this.ofiKycService.defaultrequestgetclientreferential(investorType);
    }

    gotoInvite() {
        this.router.navigateByUrl('/client-referential/invite-investors');
    }

    inviteMandateInvestors() {
        this.router.navigate(['client-referential', 'invite-mandate-investors']);
    }

    viewClient(id) {
        this.router.navigateByUrl((id == 'list' ? '/client-referential' : '/client-referential/' + id));
    }

    loadTab(tab) {
        this.currentTab = tab;
        if (tab == 2) {
            const tempOtherData = {};
            if (this.amKycList.length > 0 && this.amKycList.findIndex(kyc => kyc.kycID == this.kycId) != -1) {
                const kyc = this.amKycList.filter(kyc => kyc.kycID == this.kycId)[0];

                tempOtherData['amCompany'] = kyc.companyName;
                tempOtherData['investorData'] = {
                    firstName: kyc.investorFirstName,
                    companyName: kyc.investorCompanyName,
                    investorWalletID: kyc.investorWalletID,
                    investorWalletName: kyc.walletName,
                };

                this.otherData = tempOtherData;
                const investorWalletData = [];

                // Get the fund access for investor walletID and render it.
                this.ofiFundShareService.requestInvestorFundAccess({ investorWalletId: kyc.investorWalletID }).then((data) => {
                    get(data, '[1].Data', []).forEach((row) => {
                        investorWalletData[row['shareID']] = row;
                    });

                    this.tableData = [];
                    Object.keys(this.shareData).forEach((key) => {
                        if (this.shareData[key].draft === 0) {
                            this.tableData.push({
                                id: this.shareData[key]['fundShareID'],
                                kycId: this.kycId,
                                investorWalletID: kyc.investorWalletID,
                                accessChanged: false,
                                fundName: this.shareData[key]['fundName'],
                                shareName: this.shareData[key]['fundShareName'],
                                isin: this.shareData[key]['isin'],
                                max: ((1 + Math.min(this.shareData[key]['maxRedemptionFee'], this.shareData[key]['maxSubscriptionFee'])) * 100 - 100).toFixed(5),
                                minInvestment: this.numberConverterService.toFrontEnd(this.shareData[key]['minSubsequentSubscriptionInAmount']),
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

                    this.changeDetectorRef.markForCheck();
                }).catch((e) => {
                });
            }
        } else if (tab == 3) {
            this.ofiFundShareService.requestInvestorHoldings(this.kycId).then((data) => {
                this.holdingsTable = [];
                if (data[1].Data.length > 0) {
                    let tempArr = [];
                    let fundStats = {
                        fundName: '',
                        amount: 0,
                        ratio: 0,
                    };
                    data[1].Data.forEach((row, index) => {
                        if (tempArr.length > 0 && fundStats['fundName'] != row.fundName) {
                            this.holdingsTable.push({
                                fundName: fundStats['fundName'],
                                fundCurrency: fundStats['fundCurrency'],
                                amount: fundStats['amount'],
                                ratio: fundStats['ratio'],
                            });
                            fundStats = {
                                fundName: '',
                                amount: 0,
                                ratio: 0,
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
                        ratio: fundStats['ratio'],
                    });
                    this.holdingsTable = this.holdingsTable.concat(...tempArr);
                }
                this.changeDetectorRef.markForCheck();
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
        const decimalsVal = decimals || 0;
        return math.format((Math.floor(number * Math.pow(10, decimalsVal)) / Math.pow(10, decimalsVal)), 14);
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestKycList(requested): void {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this.ofiKycService, this.ngRedux);
        }
    }

    downloadReferentialCSVFile() {
        const investorType = (this.investorTypeForm.controls['investorType'].value.length > 0) ? this.investorTypeForm.controls['investorType'].value[0].id : -1;
        this.fileDownloader.downLoaderFile({
            method: 'getIznesReferentialCSVFile',
            token: this.socketToken,
            userId: this.userId,
            type: investorType,
        });
    }

    requestAuditSearch() {
        const params = {
            id: this.kycId,
            search: this.searchForm.controls['searchInvestor'].value,
            from: this.searchForm.controls['searchFrom'].value,
            to: this.searchForm.controls['searchTo'].value,
        };

        const asyncTaskPipe = this.ofiKycService.requestAuditSearch(params);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [OFI_SET_CLIENT_REFERENTIAL_AUDIT],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    downloadReferentialAuditCSVFile() {
        const timezone: string = moment.tz.guess();
        this.fileDownloader.downLoaderFile({
            method: 'getIznesReferentialAuditCSVFile',
            token: this.socketToken,
            userId: this.userId,
            id: this.kycId,
            search: this.searchForm.controls['searchInvestor'].value,
            from: this.searchForm.controls['searchFrom'].value,
            to: this.searchForm.controls['searchTo'].value,
            timezone,
        });
    }

    downloadAllHoldingsCSVFile() {
        this.fileDownloader.downLoaderFile({
            method: 'exportClientReferentialClientsHoldings',
            token: this.socketToken,
            userId: this.userId,
            kycIds: this.allKycIds,
        });
    }

    downloadSingleHoldingsCSVFile() {
        this.fileDownloader.downLoaderFile({
            method: 'exportClientReferentialClientHoldings',
            token: this.socketToken,
            userId: this.userId,
            kycId: this.kycId,
        });
    }

    goBack() {
        this.location.back();
    }

    changePage(page) {
        if (page == this.pageType) {
            this.viewClient('list');
        } else {
            this.pageType = page;
            if (page == 'audit') {
                if (this.kycId != '') {
                    this.searchForm.controls['searchInvestor'].patchValue(this.clients[this.kycId].companyName);
                    this.searchForm.controls['searchInvestor'].disable();
                } else {
                    this.searchForm.controls['searchInvestor'].enable();
                }
                this.requestAuditSearch();
            }
        }
    }

    saveClientReference() {
        const payload = {
            clientReference: this.investorForm.controls['clientReference'].value,
            kycID: this.currentInvestor.kycID,
        };
        this.ofiKycService.updateInvestor(payload)
            .then(() => {
                this.ofiKycService.setRequestedClientReferential(false);
                this.ofiKycService.setRequestedAMKycList(false);
                this.toasterService.pop('success', this.translate.translate('Client reference updated'));
            })
            .catch(() => {
                this.toasterService.pop('success', this.translate.translate('Failed to update client reference'));
            });
    }

    /**
     * Whether current investor is portfolio manager.
      * @return boolean
     */
    isPortfolioManager(): boolean {
        return isPortfolioManager(this.currentInvestor.investorType);
    }

    /**
     * Is the investor a discretionary portfolio manager?
     * @return boolean
     */
    isDiscretionaryManager(): boolean {
        return this.currentInvestor.investorType === InvestorType.DiscretionaryManager;
    }

    /**
     * Is the investor a fund of funds portfolio manager?
     * @return boolean
     */
    isFundOfFundsManager(): boolean {
        return this.currentInvestor.investorType === InvestorType.FundOfFundsManager;
    }

    /**
     * Is the investor a mandate investor?
     * @return boolean
     */
    isMandateInvestor(): boolean {
        return isMandate(this.currentInvestor.investorType);
    }

    /**
     * Is the investor a retail investor?
     * @return boolean
     */
    isRetail(): boolean {
        return isRetail(this.currentInvestor.investorType);
    }

    /**
     * Tear down subscriptions + cleanup
     */
    ngOnDestroy() {
        for (const key of this.subscriptions) {
            key.unsubscribe();
        }
    }
}
