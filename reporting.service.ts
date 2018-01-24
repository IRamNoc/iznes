import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HoldingByAsset, MyWalletHoldingState } from '@setl/core-store/wallet/my-wallet-holding';
import { Observable } from 'rxjs/Observable';
import { isEmpty } from 'lodash';
import { InitialisationService, WalletNodeRequestService } from '@setl/core-req-services';
import { SagaHelper, WalletTxHelper, WalletTxHelperModel } from '@setl/utils';
import {
    setRequestedWalletHolding,
    setRequestedWalletIssuer,
    SET_WALLET_ISSUER_LIST,
    SET_ISSUE_HOLDING,
    SET_ALL_TRANSACTIONS,
    SET_ASSET_TRANSACTIONS } from '@setl/core-store';
import { WalletIssuerDetail } from '../core-store/assets/my-issuers';
import 'rxjs/add/operator/combineLatest';
import { Transaction } from '../core-store/wallet/transactions/model';
import { TransactionsByAsset } from '../core-store/wallet/transactions';

export interface Asset {
    asset: string;
    total: number;
    encumbered: number;
    free: number;
    hash: string;
}

@Injectable()
export class ReportingService {

    onLoad$: Array<Observable<any>>;

    connectedWalletId: number;
    connectedChainId: number;
    myChainAccess: any;
    allTransactions$: Observable<Transaction[]>;
    transactionsByAsset$: Observable<TransactionsByAsset>;
    walletInfo = { walletName: '' };

    walletIssuerDetailSubject: BehaviorSubject<WalletIssuerDetail>;
    holdingsByAssetSubject: BehaviorSubject<any>;
    assetHoldingsSubject: BehaviorSubject<any>;

    initialised$: Observable<any>;

    constructor(
        private ngRedux: NgRedux<any>,
        private walletNodeRequestService: WalletNodeRequestService
    ) {
        const connectedWalletId$ = this.ngRedux.select(['user', 'connected', 'connectedWallet']);
        const connectedChain$ = this.ngRedux.select(['user', 'connected', 'connectedChain']);
        const myChainAccess$ = this.ngRedux.select(['chain', 'myChainAccess', 'myChainAccess']);
        const walletHoldingRequested$ = this.ngRedux.select(['wallet', 'myWalletHolding', 'requested']);
        const walletHoldingByAsset$: Observable<MyWalletHoldingState> = this.ngRedux.select(['wallet', 'myWalletHolding']);

        const walletIssuerRequested$ = this.ngRedux.select(['asset', 'myIssuers', 'requestedWalletIssuer']);
        const walletIssuerDetail$ = this.ngRedux.select(['asset', 'myIssuers', 'walletIssuerDetail']);
        const walletList$ = this.ngRedux.select(['wallet', 'walletDirectory', 'walletList']);
        const issuerList$ = this.ngRedux.select(['asset', 'myIssuers', 'issuerList']);

        this.allTransactions$ = this.ngRedux.select(['wallet', 'transactions', 'all']);
        this.transactionsByAsset$ = this.ngRedux.select(['wallet', 'transactions', 'byAsset']);

        const initialisedSubject = new BehaviorSubject<boolean>(false);
        this.holdingsByAssetSubject = new BehaviorSubject<HoldingByAsset>([]);
        this.walletIssuerDetailSubject = new BehaviorSubject<any>([]);
        this.assetHoldingsSubject = new BehaviorSubject<any>([]);

        this.initialised$ = initialisedSubject.asObservable();

        this.onLoad$ = [
            connectedWalletId$.filter(id => id > 0),
            connectedChain$.filter(id => id > 0),
            myChainAccess$.filter(chainAccess => !isEmpty(chainAccess)),
            walletList$
        ];

        Observable.combineLatest(this.onLoad$)
            .subscribe((subs) => {
                this.connectedWalletId = subs[0];
                this.connectedChainId = subs[1];
                this.myChainAccess = subs[2][this.connectedChainId];
                this.walletInfo = subs[3][this.connectedWalletId];

                initialisedSubject.next(true);
            });
        this.initialised$.filter(init => !!init).first().subscribe(() => {
            this.getTransactionsFromWalletNode();
            console.log('INIT DONE!!');
            walletHoldingRequested$.filter(req => req === false).subscribe(() => this.requestWalletHolding());
            walletIssuerRequested$.filter(req => req === false).subscribe(() => this.requestWalletIssuer());
            walletHoldingByAsset$
                .filter((wallets: MyWalletHoldingState) => {
                    return !!wallets && !isEmpty(wallets.holdingByAsset);
                }).subscribe((wallets) => {
                    if (wallets.holdingByAsset.hasOwnProperty(this.connectedWalletId)) {
                        console.log('wallets', wallets, 'connectedWalletId', this.connectedWalletId);
                        this.holdingsByAssetSubject.next(
                            Object.getOwnPropertyNames(wallets.holdingByAsset[this.connectedWalletId])
                                  .map(key => wallets.holdingByAsset[this.connectedWalletId][key])
                        );
                    }
                });
            connectedWalletId$.subscribe((connectedWalletId: number) => {
                this.connectedWalletId = connectedWalletId;
                this.refreshDataSources();
            });
            walletIssuerDetail$
                .filter((walletIssuerDetail: WalletIssuerDetail) => !!walletIssuerDetail.walletIssuer)
                .subscribe((walletIssuerDetail: WalletIssuerDetail) => {

                    const issues = this.holdingsByAssetSubject.value;

                    const formatted = issues
                        .filter((issue) => {
                            return issue.asset.split('|')[0] === walletIssuerDetail.walletIssuer;
                        })
                        .map((issue) => {
                            return {
                                asset: issue.asset,
                                total: -issue.breakdown[0].free,
                                encumbered: issue.totalencumbered,
                                free: issue.total - issue.totalencumbered
                            };
                        });

                    this.walletIssuerDetailSubject.next(formatted);
                });
        });
    }

    private refreshDataSources() {
        this.getTransactionsFromWalletNode();
        this.requestWalletHolding();
    }

    public getBalances(): Observable<Asset[]> {
        this.initialised$.filter(init => !!init).first().subscribe(() => this.requestWalletHolding());
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
            this.requestWalletIssueHolding(...asset.split('|'))
                .then((holdings: Array<any>) => {
                    console.log('holdings', holdings);
                    const total = holdings.reduce((a, h) => a + h.balance, 0);
                    return resolve(holdings.map(holding => {
                        console.log('holding', holding, total);
                        return { ...holding, walletName: this.walletInfo.walletName, percentage: (holding.balance / total) * 100 };
                    }));
                })
                .catch(() => reject('Failed to get holdings for ' + asset));
        });
    }

    public getTransactions(): Observable<Transaction[]> {
        this.initialised$.filter(init => !!init).first().subscribe(() => this.getTransactionsFromWalletNode());
        return new Observable<Transaction[]>((observer) => {
            const sub = this.allTransactions$.subscribe(txs => observer.next(txs));
            return () => sub.unsubscribe();
        });
    }

    public getTransaction(hash): Observable<Transaction> {
        this.initialised$.filter(init => !!init).first().subscribe(() => this.getTransactionsFromWalletNode());
        return new Observable<Transaction>((observer) => {
            const sub = this.allTransactions$.subscribe(txs => observer.next(txs.find(tx => tx.hash === hash)));
            return () => sub.unsubscribe();
        });
    }

    public getTransactionsForAsset(asset) {
        console.log('getTransactionsForAsset', asset);
        this.initialised$.filter(init => !!init).first().subscribe(() => this.getTransactionsFromWalletNode(asset));

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
        console.log('GETTING TX FROM WALLET NODE', payload);
        const req = this.walletNodeRequestService.requestTransactionHistory(payload, 100, 0);

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            req,
            {},
            (data) => {
                this.getTransactionsFromReportingNode(data, { ...payload, asset: asset });
            },
            (data) => {
                console.log('get transaction history error:', data);
            }
        ));
    }

    private getTransactionsFromReportingNode(data: any, payload: any): void {
        const msgsig: string = (data[1]) ? data[1].data.msgsig : null;

        if (msgsig) {
            this.walletNodeRequestService.requestTransactionHistoryFromReportingNode(
                msgsig,
                this.connectedChainId,
                this.myChainAccess.nodeAddress
            ).subscribe((res) => {
                const transactions = WalletTxHelper.WalletTxHelper.convertTransactions(res.json().data);
                if (payload.asset) {
                    const action: any = { type: SET_ASSET_TRANSACTIONS, payload: { asset: payload.asset, items: transactions }};
                    this.ngRedux.dispatch(action);
                } else {
                    const action: any = { type: SET_ALL_TRANSACTIONS, payload: { items: transactions }};
                    this.ngRedux.dispatch(action);
                }
            }, (e) => {
                console.log('reporting node error', e);
            });
        } else {
            console.log('invalid signature request');
        }
    }

    private requestWalletHolding() {
        this.ngRedux.dispatch(setRequestedWalletHolding());
        console.log('REQUEST WALLET HOLDING');
        InitialisationService.requestWalletHolding(this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
    }

    private requestWalletIssuer() {
        // Set request wallet issuers flag to true, to indicate that we have already requested wallet issuer.
        this.ngRedux.dispatch(setRequestedWalletIssuer());

        // Create a saga pipe.
        const asyncTaskPipe = this.walletNodeRequestService.walletIssuerRequest({
            walletId: this.connectedWalletId
        });

        // Send a saga action.
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_WALLET_ISSUER_LIST],
            [],
            asyncTaskPipe,
            {}
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
                            const balance = asset.holders[addr],
                                encumbered = 0,
                                free = balance - encumbered;
                            return { addr, balance, encumbered, free };
                        });
                    }

                    resolve(newHolders);
                },
                (err) => reject(err)
            ));
        });
    }
}
