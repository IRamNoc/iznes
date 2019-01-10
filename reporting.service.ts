import { combineLatest as observableCombineLatest } from 'rxjs/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { first, filter, tap, distinctUntilChanged } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { HoldingByAsset, MyWalletHoldingState } from '@setl/core-store/wallet/my-wallet-holding';
import { isEmpty, get } from 'lodash';
import {
    InitialisationService,
    WalletNodeRequestService,
    MyWalletsService,
    ReportingService as TxReportingService,
} from '@setl/core-req-services';
import { SagaHelper, WalletTxHelper, WalletTxHelperModel, LogService } from '@setl/utils';
import {
    setRequestedWalletHolding,
    setRequestedWalletIssuer,
    SET_WALLET_ISSUER_LIST,
    SET_ISSUE_HOLDING,
    SET_ALL_TRANSACTIONS,
    SET_ASSET_TRANSACTIONS,
    SET_ADDRESS_DIRECTORY,
} from '@setl/core-store';
import { WalletIssuerDetail } from '@setl/core-store/assets/my-issuers';
import {
    Transaction,
    TransactionList,
    TransactionListByAsset,
} from '@setl/core-store/wallet/transactions/model';
import {
    incrementAllCurrentPage,
    incrementAllRequestedPage,
    decrementAllCurrentPage,
    decrementAllRequestedPage,
    incrementAssetCurrentPage,
    incrementAssetRequestedPage,
    decrementAssetCurrentPage,
    decrementAssetRequestedPage,
    resetAllTransactions,
    resetAssetTransactions,
    setAllLoading,
    setAssetLoading,
} from '@setl/core-store/wallet/transactions/actions';
import { MemberSocketService } from '@setl/websocket-service';
import { createMemberNodeSagaRequest } from '@setl/utils/common';

export interface Asset {
    asset: string;
    total: number;
    encumbered: number;
    free: number;
    hash: string;
}

const refetchFilter = x => x === false;

@Injectable()
export class ReportingService {

    onLoad$: Observable<any>[];

    connectedWalletId: number;
    connectedChainId: number;
    myChainAccess: any;
    private readonly allTransactions$: Observable<TransactionList>;
    private readonly transactionsByAsset$: Observable<TransactionListByAsset>;
    walletInfo = { walletName: '' };
    addressList = [];
    addressDirectory = [];
    walletList = {};
    holdingByAddress: {}[] = [];
    requestedWalletIDs: any[] = [];

    walletIssuerDetailSubject: BehaviorSubject<WalletIssuerDetail>;
    holdingsByAssetSubject: BehaviorSubject<any>;
    assetHoldingsSubject: BehaviorSubject<any>;

    initialised$: Observable<any>;

    private walletHoldingRequested$;
    private walletIssuerRequested$;
    private labelRequested$;
    private addressesRequested$;
    private connectedWalletId$;
    private connectedChain$;
    private myChainAccess$: Observable<any>;
    private walletHoldingByAsset$: Observable<MyWalletHoldingState>;
    private walletIssuerDetail$;
    private walletList$;
    private addressList$;
    private addressDirectory$;
    private issuerList$;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private reportingService: TxReportingService,
                private logService: LogService,
                private myWalletService: MyWalletsService,
                private memberSocketService: MemberSocketService,
    ) {
        this.connectedWalletId$ = this.ngRedux.select(['user', 'connected', 'connectedWallet']);
        this.connectedChain$ = this.ngRedux.select(['user', 'connected', 'connectedChain']);
        this.myChainAccess$ = this.ngRedux.select(['chain', 'myChainAccess', 'myChainAccess']);
        this.walletHoldingByAsset$ = this.ngRedux.select(['wallet', 'myWalletHolding']);

        this.walletIssuerDetail$ = this.ngRedux.select(['asset', 'myIssuers', 'walletIssuerDetail']);
        this.walletList$ = this.ngRedux.select(['wallet', 'walletDirectory', 'walletList']);
        this.addressList$ = this.ngRedux.select(['wallet', 'myWalletAddress', 'addressList']);
        this.addressDirectory$ = this.ngRedux.select(['wallet', 'addressDirectory']);
        this.issuerList$ = this.ngRedux.select(['asset', 'myIssuers', 'issuerList']);

        this.walletHoldingRequested$ = this.ngRedux.select(['wallet', 'myWalletHolding', 'requested']);
        this.walletIssuerRequested$ = this.ngRedux.select(['asset', 'myIssuers', 'requestedWalletIssuer']);
        this.labelRequested$ = this.ngRedux.select(['wallet', 'myWalletAddress', 'requestedLabel']);
        this.addressesRequested$ = this.ngRedux.select(['wallet', 'myWalletAddress', 'requestedCompleteAddresses']);

        this.allTransactions$ = this.ngRedux.select(['wallet', 'transactions', 'all']);
        this.transactionsByAsset$ = this.ngRedux.select(['wallet', 'transactions', 'byAsset']);

        const initialisedSubject = new BehaviorSubject<boolean>(false);
        this.holdingsByAssetSubject = new BehaviorSubject<HoldingByAsset>([]);
        this.walletIssuerDetailSubject = new BehaviorSubject<any>([]);
        this.assetHoldingsSubject = new BehaviorSubject<any>([]);

        this.initialised$ = initialisedSubject.asObservable();

        this.onLoad$ = [
            this.myChainAccess$.pipe(
                filter(chainAccess => !isEmpty(chainAccess)),
            ),
            this.walletList$,
            this.addressList$,
        ];

        const idStream$ = observableCombineLatest(
            [
                this.connectedWalletId$.pipe(
                    filter(id => id > 0), distinctUntilChanged()),
                this.connectedChain$.pipe(filter(id => id > 0), distinctUntilChanged()),
            ],
        ).pipe(
            tap(([connectedWalletId, connectedChainId]) => {
                this.connectedWalletId = connectedWalletId;
                this.connectedChainId = connectedChainId;
                this.requestWalletData();
            }));

        const dataStream$ = observableCombineLatest(idStream$, ...this.onLoad$, (ids, ...rest) => {
                return [...ids, ...rest];
            }).pipe(
            filter(([a, b, c, d, addressList]) => !isEmpty(addressList)))
        ;
        dataStream$.subscribe(([connectedWalletId, connectedChainId, chainAccess, walletList, addressList]) => {
            this.walletList = walletList;
            this.myChainAccess = chainAccess[this.connectedChainId];
            this.walletInfo = walletList[this.connectedWalletId];
            this.addressList = addressList;

            initialisedSubject.next(true);
        });

        const requestedStream$ = observableCombineLatest(
            idStream$,
            this.labelRequested$,
            this.addressesRequested$,
        ).pipe(
            filter(([ids, labelRequested, addressesRequested]) => labelRequested && addressesRequested))
        .subscribe(() => initialisedSubject.next(true));

        this.initialised$.pipe(
            filter(init => !!init),
            first(),
        ).subscribe(() => {
            this.getTransactionsFromReportingNode();
            this.initRefetchData();
            this.initSubscriptions();
        });

        this.addressDirectory$.subscribe((addresses) => {
            this.addressDirectory = addresses;
        });
    }

    private initRefetchData() {
        this.walletHoldingRequested$.pipe(filter(refetchFilter)).subscribe(() => this.requestWalletHolding());
        this.walletIssuerRequested$.pipe(filter(refetchFilter)).subscribe(() => this.requestWalletIssuer());
        this.labelRequested$.pipe(filter(refetchFilter)).subscribe(() => this.requestWalletData());
    }

    public initSubscriptions() {
        const filteredWalletHolding$ = this.walletHoldingByAsset$.pipe(
            filter((wallets: MyWalletHoldingState) => {
                return !!wallets && !isEmpty(wallets.holdingByAsset);
            }))
        ;
        const combined$ = observableCombineLatest(filteredWalletHolding$, this.addressList$);
        combined$.subscribe(([wallets, addresses]) => {
            this.getBreakdownData(wallets, addresses);
        });

        this.connectedWalletId$.subscribe((connectedWalletId: number) => {
            this.connectedWalletId = connectedWalletId;
            this.refreshDataSources();
        });

        const combinedWallet$ = observableCombineLatest(this.walletIssuerDetail$, this.holdingsByAssetSubject);
        combinedWallet$.subscribe(([walletIssuerDetail, holdingsByAsset]) => {
            this.handleWalletIssuerDetail(<WalletIssuerDetail>walletIssuerDetail, holdingsByAsset);
        });
    }

    private handleWalletIssuerDetail(walletIssuerDetail: WalletIssuerDetail, holdingsByAsset) {
        const issues = holdingsByAsset;
        const formatted = issues
        .filter((issue) => {
            return issue.asset.split('|')[0] === walletIssuerDetail.walletIssuer;
        })
        .map((issue) => {
            return {
                asset: issue.asset,
                addressLabel: issue.breakdown[0].label,
                address: issue.breakdown[0].addr,
                total: -issue.breakdown[0].free,
                encumbered: issue.totalencumbered,
                free: issue.total - issue.totalencumbered,
            };
        });

        this.walletIssuerDetailSubject.next(formatted);

    }

    private getBreakdownData(wallets, addresses) {
        // Clear observable if user does not have a connected wallet ID
        if (this.connectedWalletId === 0) this.holdingsByAssetSubject.next([]);

        this.holdingByAddress = wallets.holdingByAddress;
        if (wallets.holdingByAsset.hasOwnProperty(this.connectedWalletId)) {
            const next = Object
            .getOwnPropertyNames(wallets.holdingByAsset[this.connectedWalletId])
            .map((key) => {
                const asset = wallets.holdingByAsset[this.connectedWalletId][key];

                // Merge in address labels
                asset.breakdown = asset.breakdown.map(breakdown => ({
                    ...breakdown,
                    ...addresses[breakdown.addr],
                }));

                return asset;
            });
            this.holdingsByAssetSubject.next(next);
        }
    }

    private refreshDataSources() {
        this.getTransactionsFromReportingNode();
        this.requestWalletHolding();
    }

    public getBalances(): Observable<Asset[]> {
        this.initialised$.pipe(
            filter(init => !!init),
            first(),
        ).subscribe(() => this.requestWalletHolding());
        return new Observable<any>((observer) => {
            const sub = this.holdingsByAssetSubject.subscribe(observer);
            return () => sub.unsubscribe();
        });
    }

    public getIssuers(): Observable<any> {
        return this.walletIssuerDetailSubject.asObservable();
    }

    public getHoldings(asset: string) {
        return new Promise((resolve, reject) => {
            const assetPieces = asset.split('|');
            this.requestWalletIssueHolding(assetPieces[0], assetPieces[1])
            .then((holdings: any[]) => {
                const total = holdings.filter(h => h.balance > 0).reduce((a, h) => a + h.balance, 0);
                return resolve(holdings.map(
                    (holding) => {
                        // Request the holding wallet detail and save to Redux
                        this.requestHoldingWalletAddressDetail(holding);
                        return {
                            ...holding,
                            walletName: 'Updating wallet name..',
                            addrLabel: holding.addr,
                            percentage: (holding.balance > 0) ? (holding.balance / total) * 100 : null,
                        };
                    },
                ));
            })
            .catch(() => reject(`Failed to get holdings for ${asset}`));
        });
    }

    /**
     * Request Holding Wallet Address Detail
     * -------------------------------------
     * Requests the address labels and wallet ID for a holding if needed, and saves to Redux
     *
     * @param holding
     */
    private requestHoldingWalletAddressDetail(holding) {

        // Check if we know the wallet ID
        let walletID = isEmpty(this.holdingByAddress) ? 0 : Number(Object.keys(this.holdingByAddress).find((wallet) => {
            return this.holdingByAddress[wallet][holding.addr];
        }));

        // Request the wallet ID if we don't have it
        if (!walletID) {
            const asyncTaskPipe = this.requestWalletID(holding.addr);
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    walletID = Number(data[1].Data[0].leiID);
                    // Request the address labels if we don't have them
                    this.requestAddressLabels(walletID, holding.addr);
                },
            ));
        } else {
            // Request the address labels if we don't have them
            this.requestAddressLabels(walletID, holding.addr);
        }
    }

    /**
     * Map Holding
     * -----------
     * Maps the holdings for issue reports to fetch the walletName and addrLabel
     *
     * @param holdings
     * @param addresses
     */
    public mapHolding(holdings, addresses) {
        return holdings.map((holding) => {
            const walletID = addresses.hasOwnProperty(holding.addr) ? addresses[holding.addr].walletID : 0;
            return {
                walletName: walletID ? this.walletList[walletID].walletName : 'Updating wallet name..',
                addrLabel: walletID ? addresses[holding.addr].label : 'Updating wallet name..',
                addr: holding.addr,
                percentage: holding.percentage,
                balance: holding.balance,
                encumbered: holding.encumbered,
                free: holding.free,
            };
        });
    }

    public getTransactions(): Observable<TransactionList> {
        this.initialised$.pipe(
            filter(init => !!init),
            first(),
        ).subscribe(() => this.getTransactionsFromReportingNode());

        return new Observable<TransactionList>((observer) => {
            const sub = this.allTransactions$.subscribe(txs => observer.next(txs));
            return () => sub.unsubscribe();
        });
    }

    public getTransaction(hash): Observable<Transaction> {
        this.initialised$.pipe(
            filter(init => !!init),
            first(),
        ).subscribe(() => this.getTransactionsFromReportingNode());

        return new Observable<Transaction>((observer) => {
            const sub = this.allTransactions$.subscribe((txs) => {
                txs.pages.find((page) => {
                    const tx = page.transactions.find(tx => tx.hash === hash);
                    if (!tx) {
                        return false;
                    }
                    observer.next(tx);
                    return true;
                });
            });
            return () => sub.unsubscribe();
        });
    }

    public getTransactionsForAsset(asset): Observable<TransactionList> {
        this.initialised$.pipe(
            filter(init => !!init),
            first(),
        ).subscribe(() => this.getTransactionsFromReportingNode(asset));

        return new Observable<TransactionList>((observer) => {
            const sub = this.transactionsByAsset$.subscribe((txs) => {
                if (txs.hasOwnProperty(asset)) {
                    observer.next(txs[asset]);
                }
            });
            return () => sub.unsubscribe();
        });
    }

    historyPaginationAll(direction: 'prev' | 'next'): void {
        switch (direction) {
        case 'prev':
            this.ngRedux.dispatch(decrementAllCurrentPage());
            this.ngRedux.dispatch(decrementAllRequestedPage());
            break;
        case 'next':
            this.ngRedux.dispatch(incrementAllRequestedPage());
            const state = this.ngRedux.getState().wallet.transactions.all;
            if (!(state.requestedPage in state.pages)) {
                this.ngRedux.dispatch(setAllLoading());
                this.reloadAllTransactionsFromReportingNode();
            } else {
                this.ngRedux.dispatch(incrementAllCurrentPage());
            }
            break;
        }
    }

    historyResetAll() {
        this.ngRedux.dispatch(resetAllTransactions());
        this.reloadAllTransactionsFromReportingNode();
    }

    historyPaginationByAsset(asset: string, direction: 'prev' | 'next'): void {
        switch (direction) {
        case 'prev':
            this.ngRedux.dispatch(decrementAssetCurrentPage(asset));
            this.ngRedux.dispatch(decrementAssetRequestedPage(asset));
            break;
        case 'next':
            this.ngRedux.dispatch(incrementAssetRequestedPage(asset));
            const state = this.ngRedux.getState().wallet.transactions.byAsset[asset];
            if (!(state.requestedPage in state.pages)) {
                this.ngRedux.dispatch(setAssetLoading(asset));
                this.reloadTransactionsByAssetFromReportingNode(asset);
            } else {
                this.ngRedux.dispatch(incrementAssetCurrentPage(asset));
            }
            break;
        }
    }

    historyResetByAsset(asset: string) {
        this.ngRedux.dispatch(resetAssetTransactions(asset));
        this.reloadTransactionsByAssetFromReportingNode(asset);
    }

    private getTransactionsFromReportingNode(asset?: string): void {
        if (asset) {
            console.warn('getTransactionFromReportingNode', asset);
            return this.reloadTransactionsByAssetFromReportingNode(asset);
        }
        return this.reloadAllTransactionsFromReportingNode();
    }

    private reloadTransactionsByAssetFromReportingNode(asset: string): void {
        const [namespace, classId] = asset.split('|');
        const state = get(this.ngRedux.getState().wallet.transactions.byAsset, asset, null);
        let before = null;
        if (state && state.requestedPage > 0) {
            before = state.pages[state.requestedPage - 1].next;
        }
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ASSET_TRANSACTIONS],
            [],
            this.reportingService.getTransactionsByAsset(this.connectedWalletId, namespace, classId, before),
        ));
    }

    private reloadAllTransactionsFromReportingNode(): void {
        const state = this.ngRedux.getState().wallet.transactions.all;
        let before = null;
        if (state.requestedPage > 0) {
            before = state.pages[state.requestedPage - 1].next;
        }
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ALL_TRANSACTIONS],
            [],
            this.reportingService.getTransactions(this.connectedWalletId, before),
        ));
    }

    private requestWalletHolding() {
        setTimeout(
            () => {
                this.ngRedux.dispatch(setRequestedWalletHolding());
                InitialisationService.requestWalletHolding(
                    this.ngRedux, this.walletNodeRequestService, this.connectedWalletId,
                );
            },
            1000);
    }

    private requestWalletData() {
        InitialisationService.requestWalletAddresses(
            this.ngRedux,
            this.walletNodeRequestService,
            this.connectedWalletId,
        );
        MyWalletsService.defaultRequestWalletLabel(this.ngRedux, this.myWalletService, this.connectedWalletId);
    }

    /**
     * Request Address Labels
     * ----------------------
     * Request all of the addresses within a wallet and save them to Redux
     *
     * @param walletId
     */
    private requestAddressLabels(walletId: number, address: string) {
        // Check we don't already have them
        if (isEmpty(this.addressDirectory[address]) && !this.requestedWalletIDs.includes(walletId)) {
            const asyncTaskPipe = this.myWalletService.requestWalletLabel({
                walletId,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_ADDRESS_DIRECTORY],
                [],
                asyncTaskPipe,
                {},
            ));

            // Push wallet ID to requested array
            this.requestedWalletIDs.push(walletId);
        }
    }

    /**
     * Request Wallet ID
     * -----------------
     * Get the wallet ID of an address
     *
     * @param address
     */
    private requestWalletID(address: string): any {
        const messageBody = {
            RequestName: 'gwidbya',
            token: this.memberSocketService.token,
            address,
        };

        return createMemberNodeSagaRequest(this.memberSocketService, messageBody);
    }

    private requestWalletIssuer() {
        // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
        this.ngRedux.dispatch(setRequestedWalletIssuer());

        // Create a saga pipe.
        const asyncTaskPipe = this.walletNodeRequestService.walletIssuerRequest({
            walletId: this.connectedWalletId,
        });

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_ISSUER_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    private requestWalletIssueHolding(issuer?: string, instrument?: string) {
        this.ngRedux.dispatch(setRequestedWalletIssuer());

        const asyncTaskPipe = this.walletNodeRequestService.requestWalletIssueHolding({
            walletId: this.connectedWalletId,
            issuer,
            instrument,
        });

        const identifider = `${issuer}|${instrument}`;

        return new Promise((resolve, reject) => {
            // Send a saga action.
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_ISSUE_HOLDING],
                [],
                asyncTaskPipe,
                {},
                () => {
                    const asset = this.holdingsByAssetSubject.getValue().find(item => item.asset === identifider);
                    let newHolders = [];
                    if (asset.holders) {
                        newHolders = Object.getOwnPropertyNames(asset.holders).map((addr) => {
                            const balance = asset.holders[addr];
                            const breakdown = asset.breakdown.find(holding => holding.addr === addr);
                            const encumbered = (breakdown || {}).encumbrance || 0;
                            const free = balance - encumbered;
                            return { addr, balance, encumbered, free };
                        });
                    }

                    resolve(newHolders);
                },
                err => reject(err),
            ));
        });
    }
}
