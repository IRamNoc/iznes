import { combineLatest as observableCombineLatest } from 'rxjs/observable/combineLatest';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { first, filter, tap, distinctUntilChanged } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { HoldingByAsset, MyWalletHoldingState } from '@setl/core-store/wallet/my-wallet-holding';
import { isEmpty, isArray, some } from 'lodash';
import { InitialisationService, WalletNodeRequestService, MyWalletsService } from '@setl/core-req-services';
import { SagaHelper, WalletTxHelper, WalletTxHelperModel, LogService } from '@setl/utils';
import { MemberSocketService } from '@setl/websocket-service';
import {
    setRequestedWalletHolding,
    setRequestedWalletIssuer,
    setRequestedWalletLabel,
    SET_WALLET_ISSUER_LIST,
    SET_ISSUE_HOLDING,
    SET_ALL_TRANSACTIONS,
    SET_ASSET_TRANSACTIONS,
} from '@setl/core-store';
import { WalletIssuerDetail } from '@setl/core-store/assets/my-issuers';
import { Transaction } from '@setl/core-store/wallet/transactions/model';
import { TransactionsByAsset } from '@setl/core-store/wallet/transactions';
import { SET_ADDRESS_DIRECTORY } from '@setl/core-store/index';
import { RequestOwnWalletsMessageBody } from "@setl/core-req-services/my-wallets/my-wallets.service.model";
import { createMemberNodeSagaRequest } from "@setl/utils/common";

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
    allTransactions$: Observable<Transaction[]>;
    transactionsByAsset$: Observable<TransactionsByAsset>;
    walletInfo = { walletName: '' };
    addressList = [];
    walletList = {};
    holdingByAddress: {}[] = [];

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
            }))

        const dataStream$ = observableCombineLatest(idStream$, ...this.onLoad$, (ids, ...rest) => {
                return [...ids, ...rest];
            }).pipe(
            filter(([a, b, c, d, addressList]) => !isEmpty(addressList)))
        ;
        dataStream$.subscribe(([connectedWalletId, connectedChainId, chainAccess, walletList, addressList]) => {
            this.walletList = walletList;
            this.myChainAccess = chainAccess[this.connectedChainId];
            this.walletInfo = walletList[this.connectedWalletId];

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
            this.getTransactionsFromWalletNode();
            this.initRefetchData();
            this.initSubscriptions();
        });

        /* Subscribe to get address labels by wallet ID */
        this.addressDirectory$.subscribe((addresses) => {
            this.addressList = addresses;
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
            this.handleWalletIssuerDetail(<WalletIssuerDetail>walletIssuerDetail, holdingsByAsset)
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
                addressLabel: isEmpty(issue.breakdown[0].label) ? 'Unknown' : issue.breakdown[0].label,
                address: isEmpty(issue.breakdown[0].addr) ? 'Unknown' : issue.breakdown[0].addr,
                total: -issue.breakdown[0].free,
                encumbered: issue.totalencumbered,
                free: issue.total - issue.totalencumbered,
            };
        });

        this.walletIssuerDetailSubject.next(formatted);

    }

    private getBreakdownData(wallets, addresses) {
        this.holdingByAddress = wallets.holdingByAddress;
        if (wallets.holdingByAsset.hasOwnProperty(this.connectedWalletId)) {
            const next = Object
            .getOwnPropertyNames(wallets.holdingByAsset[this.connectedWalletId])
            .map((key) => {
                const asset = wallets.holdingByAsset[this.connectedWalletId][key];

                // Merge in address labels
                asset.breakdown = asset.breakdown.map(breakdown => ({
                    ...breakdown,
                    ...addresses[breakdown.addr]
                }));

                return asset;
            })
            this.holdingsByAssetSubject.next(next);
        }
    }

    private refreshDataSources() {
        this.getTransactionsFromWalletNode();
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
                        //return this.mapHolding(holding, total);
                        return {
                            ...holding,
                            percentage: (holding.balance > 0) ? (holding.balance / total) * 100 : null,
                        };
                    },
                ));
            });
            //.catch(() => reject('Failed to get holdings for ' + asset));
        });
    }

    public mapHolding(holdings) {
        holdings.map((holding) => {
            let walletID;
            let walletName;
            /* Request wallet ID */
            const asyncTaskPipe = this.requestWalletID(holding.addr);
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                asyncTaskPipe,
                (data) => {
                    walletID = Number(data[1].Data[0].leiID);
                    /* Request the address labels for the wallet if we don't already have them */
                    if (isEmpty(this.addressList[walletID])) {
                        console.log('+++ req labels');
                        this.requestAddressLabels(walletID);
                    }
                    walletName = this.walletList[walletID].walletName;

                    return {
                        ...holding,
                        walletID,
                        walletName,
                    };
                },
            ));
        });
    }

    public getTransactions(): Observable<Transaction[]> {
        this.initialised$.pipe(filter(init => !!init), first(),).subscribe(() => this.getTransactionsFromWalletNode());

        return new Observable<Transaction[]>((observer) => {
            const sub = this.allTransactions$.subscribe(txs => observer.next(txs));
            return () => sub.unsubscribe();
        });
    }

    public getTransaction(hash): Observable<Transaction> {
        this.initialised$.pipe(filter(init => !!init), first(),).subscribe(() => this.getTransactionsFromWalletNode());

        return new Observable<Transaction>((observer) => {
            const sub = this.allTransactions$.subscribe(txs => observer.next(txs.find(tx => tx.hash === hash)));
            return () => sub.unsubscribe();
        });
    }

    public getTransactionsForAsset(asset) {
        this.initialised$.pipe(
            filter(init => !!init),
            first(),
        ).subscribe(() => this.getTransactionsFromWalletNode(asset));

        return new Observable<Transaction[]>((observer) => {
            const sub = this.transactionsByAsset$.subscribe((txs) => {
                if (txs.hasOwnProperty(asset)) {
                    observer.next(txs[asset]);
                }
            });
            return () => sub.unsubscribe();
        });
    }

    private getTransactionsFromWalletNode(asset?: string): void {
        const payload = {
            walletIds: [this.connectedWalletId],
            chainId: this.connectedChainId,
        };
        if (asset) {
            payload['asset'] = asset.split('|')[1];
        }
        const req = this.walletNodeRequestService.requestTransactionHistory(payload, 100, 0);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            req,
            {},
            (data) => {
                this.getTransactionsFromReportingNode(data, { ...payload, asset });
            },
            (data) => {
                this.logService.log('get transaction history error:', data);
            },
        ));
    }

    private getTransactionsFromReportingNode(data: any, payload: any): void {
        const msgsig: string = (data[1]) ? data[1].data.msgsig : null;

        if (msgsig) {
            this.walletNodeRequestService.requestTransactionHistoryFromReportingNode(
                msgsig,
                this.connectedChainId,
                this.myChainAccess.nodeAddress,
            ).subscribe(
                (res) => {
                    const transactions = WalletTxHelper.WalletTxHelper.convertTransactions(res.json().data);
                    if (payload.asset) {
                        const action: any = {
                            type: SET_ASSET_TRANSACTIONS,
                            payload: { asset: payload.asset, items: transactions }
                        };
                        this.ngRedux.dispatch(action);
                    } else {
                        const action: any = { type: SET_ALL_TRANSACTIONS, payload: { items: transactions } };
                        this.ngRedux.dispatch(action);
                    }
                },
                (e) => {
                    this.logService.log('reporting node error', e);
                });
        } else {
            this.logService.log('invalid signature request');
        }
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
    private requestAddressLabels(walletId: number) {
        const asyncTaskPipe = this.myWalletService.requestWalletLabel({
            walletId,
        });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_ADDRESS_DIRECTORY],
            [],
            asyncTaskPipe,
            {},
        ));
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
                            const encumbered = 0;
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
