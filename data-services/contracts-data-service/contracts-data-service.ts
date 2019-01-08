import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import {BaseDataService, WalletNodeRequestService} from '@setl/core-req-services';
import { Observable } from 'rxjs/Rx';
import {mergeMap, map, filter} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ContractsDataService extends BaseDataService<WalletNodeRequestService> {
    @select(['user', 'connected', 'connectedWallet']) private getConnectedWallet$: Observable<number>;
    @select(['wallet', 'myWalletContract', 'contractList']) private getContractList$;
    @select(['wallet', 'myWalletContract', 'updatedContractList']) private updateContractList$;

    constructor(
        private walletNodeRequestService: WalletNodeRequestService,
    ) {
        super(walletNodeRequestService);
        super.setupData(
            'contractList',
            'defaultRequestContractsByWallet',
            this.getContractList$,
            this.needUpdateContract());
    }

    /**
     * return observable<boolean> to work out whether we need to update contracts.
     */
    needUpdateContract(): Observable<boolean> {
       return (this.updateContractList$ as Observable<string[]>).pipe(
          map(cs => cs.length > 0),
       );
    }

    /**
     * Get contract list in array format
     * @return {Observable<any[]>}
     */
    getContractArrayList(): Observable<any> {
        return this.getConnectedWallet$.pipe(
            filter(c => +c !== 0),
            mergeMap((c) => {
                return super.getData<any[]>('contractList', c);
            }),
        ).pipe(
            map((cd) => {
                if (typeof cd === 'undefined' || cd.length <= 0) {
                    return [];
                }
                return cd[0].contractData;
            }),
        );
    }
}
