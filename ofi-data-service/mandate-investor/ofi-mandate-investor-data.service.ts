import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { BaseDataService } from '@setl/core-req-services';
import { Observable } from 'rxjs/Rx';
import { OfiMandateInvestorService } from '../../ofi-req-services/ofi-mandate-investor/service';
import { MandateInvestor } from '../../ofi-store/ofi-mandate-investor/mandate-investor-list/model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MandateInvestorDataService extends BaseDataService<OfiMandateInvestorService> {
    @select(['ofi', 'ofiMandateInvestor', 'list', 'records']) list$;
    @select(['ofi', 'ofiMandateInvestor', 'list', 'requested']) listRequested$;

    constructor(
        private investorService: OfiMandateInvestorService,
    ) {
        super(investorService);
        super.setupData(
            'mandateInvestorList',
            'defaultList',
            this.list$,
            this.listRequested$);
    }

    list(): Observable<{ [id: number]: MandateInvestor }> {
        return super.getData('mandateInvestorList');
    }

    listArray(): Observable<MandateInvestor[]> {
        return this.list().pipe(map(i => Object.keys(i).map(k => i[k])));
    }
}
