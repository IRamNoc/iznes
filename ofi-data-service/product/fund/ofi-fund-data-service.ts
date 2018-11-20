import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { BaseDataService } from '@setl/core-req-services';
import { Observable } from 'rxjs/Rx';
import { OfiFundService } from '../../../ofi-req-services/ofi-product/fund/fund.service';
import { IznesFundDetail, IznesFundDetails } from '../../../ofi-store/ofi-product/fund/fund-list/model';
import { map } from 'rxjs/operators';

@Injectable()
export class OfiFundDataService extends BaseDataService<OfiFundService> {
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requestedIznesFund']) requestedIznesFund$;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundList$;

    constructor(
        private _ofiKycService: OfiFundService,
    ) {
        super(_ofiKycService);
        super.setupData(
            'fundList',
            'fetchFundList',
            this.fundList$,
            this.requestedIznesFund$);
    }

    /**
     * Get fund list in map format
     * @return {Observable<IznesFundDetails>}
     */
    getFunds(): Observable<IznesFundDetails> {
        return super.getData<IznesFundDetails>('fundList');
    }

    /**
     * Get fund list in array format
     * @param includeDraft {boolean}: include draft status
     * @return {Observable<IznesFundDetail[]>}
     */
    getFundArrayList(includeDraft: boolean = false): Observable<IznesFundDetail[]> {

        return super.getData<IznesFundDetails>('fundList')
        .pipe(
            map((funds: IznesFundDetails) => {
                const fundList = [];
                for (const key in funds) {
                    const fund = funds[key];
                    if (!includeDraft) {
                        if (Number(fund.draft) === 0) {
                            fundList.push(fund);
                        }
                    } else {
                        fundList.push(fund);
                    }
                }
                return fundList;
            }),
        );
    }

    /**
     * Get fund list in ng2-select format.
     * @param includeDraft {boolean}: include draft status
     * @return {Observable<{id: string; text: string}[]>}
     */
    getFundSelectList(includeDraft: boolean = false): Observable<{id: string; text: string}[]> {
        return super.getData<IznesFundDetails>('fundList')
        .pipe(
            map((funds: IznesFundDetails) => {
                const fundList = [];
                for (const key in funds) {
                    const fund = funds[key];
                    const fundSelectItem = { id: key, text: funds[key].fundName };
                    if (!includeDraft) {
                        if (Number(fund.draft) === 0) {
                            fundList.push(fundSelectItem);
                        }
                    } else {
                        fundList.push(fundSelectItem);
                    }
                }
                return fundList;
            }),
        );
    }
}
