import { Injectable, ChangeDetectorRef } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { combineLatest, Subscription, Subject } from 'rxjs';
import * as _ from 'lodash';
import { ToasterService } from 'angular2-toaster';
import {
    SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    resetSubPortfolioBankingDetailsRequested,
    SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST,
} from '@ofi/ofi-main/ofi-store';
import { clearRequestedWalletLabel, setRequestedWalletAddresses } from '@setl/core-store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { OfiSubPortfolioReqService } from '@ofi/ofi-main/ofi-req-services/ofi-sub-portfolio/service';
import { FileService } from '@setl/core-req-services/file/file.service';
import { WalletNodeRequestService, MyWalletsService, InitialisationService } from '@setl/core-req-services';

@Injectable({
    providedIn: 'root',
})
export class OfiSubPortfolioService {

    private subscriptions: Array<Subscription> = [];
    private requestedBankingDetails: boolean = false;
    private requestedWalletLabel: boolean = false;
    private requestedWalletAddresses: boolean = false;
    public subPortfolioList: any[] = [];
    public connectedWalletId: number = 0;
    public subPortfolioListOb: Subject<any> = new Subject;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['ofi', 'ofiSubPortfolio', 'requested']) subPortfolioRequestedOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['ofi', 'ofiSubPortfolio', 'bankingDetails']) subPortfolioBankingDetailsOb;

    constructor(
        private ngRedux: NgRedux<any>,
        private walletNodeRequestService: WalletNodeRequestService,
        private myWalletsService: MyWalletsService,
        private ofiSubPortfolioReqService: OfiSubPortfolioReqService,
        private myWalletService: MyWalletsService,
        private toaster: ToasterService,
        private fileService: FileService,
    ) {
        this.initSubscriptions();
    }

    /**
     * Initialise Subscriptions
     * @return void
     */
    private initSubscriptions() {
        this.subscriptions.push(
            combineLatest(this.connectedWalletOb, this.subPortfolioRequestedOb, this.requestedAddressListOb, this.requestedLabelListOb)
            .subscribe(([walletID, subPortRequested, addrListRequested, labelListRequested]) => {
                if (walletID !== this.connectedWalletId) {
                    this.resetRequestedFlags();
                }
                this.connectedWalletId = walletID;
                this.requestBankingDetails(subPortRequested);
                this.requestAddressList(addrListRequested);
                this.requestWalletLabel(labelListRequested);
            }));

        this.subscriptions.push(combineLatest(this.addressListOb, this.subPortfolioBankingDetailsOb)
            .subscribe(([addressList, bankingDetails]) => {
                this.subPortfolioList = [];
                Object.keys(addressList).forEach((subPortfolio) => {
                    this.subPortfolioList.push(Object.assign({}, addressList[subPortfolio], bankingDetails[subPortfolio]));
                });
                this.updateSubPortfolioObservable();
            }));
    }

    /**
     * Resets the requested flags for Wallet Addresses, Labels and Sub-portfolio banking details
     * @return void
     */
    public resetRequestedFlags() {
        this.requestedBankingDetails = false;
        this.requestedWalletLabel = false;
        this.requestedWalletAddresses = false;
        this.ngRedux.dispatch(resetSubPortfolioBankingDetailsRequested());
        this.ngRedux.dispatch(clearRequestedWalletLabel());
    }

    /**
     * Calls next on the Sub-portfolio List Observable
     * @return void
     */
    public updateSubPortfolioObservable() {
        this.subPortfolioListOb.next(this.subPortfolioList);
    }

    /**
     * Gets the Sub-portfolio list observable
     * @return {observable} subPortfolioListOb
     */
    public getSubPortfolioData() {
        return this.subPortfolioListOb;
    }

    /**
     * Requests the Sub-portfolio banking details based on requested flags
     * @param requestedState
     */
    public requestBankingDetails(requestedState) {
        if (!requestedState && this.connectedWalletId !== 0 && !this.requestedBankingDetails) {
            this.requestedBankingDetails = true;
            const asyncTaskPipe = this.ofiSubPortfolioReqService.getSubPortfolioBankingDetails({
                walletId: this.connectedWalletId,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED, SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST],
                [],
                asyncTaskPipe,
                {},
            ));
        }
    }

    /**
     * Requests Wallet Addresses based on requested flags
     * @param requestedState
     */
    requestAddressList(requestedState) {
        if (!requestedState && this.connectedWalletId !== 0 && !this.requestedWalletAddresses) {
            this.requestedWalletAddresses = true;
            this.ngRedux.dispatch(setRequestedWalletAddresses());
            InitialisationService.requestWalletAddresses(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
        }
    }

    /**
     * Requests Wallet Labels based on requested flags
     * @param requestedState
     */
    requestWalletLabel(requestedState) {
        if (!requestedState && this.connectedWalletId !== 0 && !this.requestedWalletLabel) {
            this.requestedWalletLabel = true;
            MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }

    getSubPortfolioFormValue(values, bankIdentificationStatement) {
        return {
            ..._.omit(values, ['hashIdentifierCode']),
            walletId: this.connectedWalletId,
            country: _.get(values, 'country[0].id', values.country),
            accountCurrency: _.get(values.accountCurrency, [0, 'id'], values.accountCurrency),
            custodianPayment: _.get(values.custodianPayment, [0, 'id'], 0),
            custodianPosition: _.get(values.custodianPosition, [0, 'id'], 0),
            custodianTransactionNotices: _.get(values.custodianTransactionNotices, [0, 'id'], 0),
            ownerCountry: _.get(values.ownerCountry, [0, 'id'], values.ownerCountry),
            bankIdentificationStatement: JSON.stringify(bankIdentificationStatement),
            useCBDC: values.useCBDC ? 1 : 0,
        };
    }

    uploadFile(event, modelItem, changeDetectorRef: ChangeDetectorRef): void {
        const asyncTaskPipe = this.fileService.addFile({
            files: _.filter(event.files, (file) => {
                return file.status !== 'uploaded-file';
            }),
        });

        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                if (data[1] && data[1].Data) {
                    let errorMessage;

                    _.each(data[1].Data, (file) => {
                        if (file.error) {
                            errorMessage = file.error;
                            event.target.updateFileStatus(file.id, 'file-error');
                        } else {
                            event.target.updateFileStatus(file[0].id, 'uploaded-file');
                            modelItem.control.patchValue(file[0].fileID);
                            modelItem.fileData = {
                                fileID: file[0].fileID,
                                hash: file[0].fileHash,
                                name: file[0].fileTitle,
                            };
                        }
                    });

                    if (errorMessage) {
                        this.toaster.pop('error', errorMessage);
                    }

                    if (data[1].Data.length === 0) {
                        modelItem.control.patchValue(null);
                        modelItem.fileData = null;
                    }

                    changeDetectorRef.markForCheck();
                    changeDetectorRef.detectChanges();
                }
            },
            (data) => {
                let errorMessage;

                _.each(data[1].Data, (file) => {
                    if (file.error) {
                        errorMessage += file.error + '<br/>';
                        event.target.updateFileStatus(file.id, 'file-error');
                    }
                });

                if (errorMessage) {
                    if (errorMessage) {
                        this.toaster.pop('error', errorMessage);
                    }
                }
            }),
        );
    }
}
