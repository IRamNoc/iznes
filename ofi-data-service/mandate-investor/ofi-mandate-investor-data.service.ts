import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { BaseDataService, MyUserService } from '@setl/core-req-services';
import { Observable } from 'rxjs/Rx';
import { OfiMandateInvestorService } from '../../ofi-req-services/ofi-mandate-investor/service';
import { MandateInvestor } from '../../ofi-store/ofi-mandate-investor/mandate-investor-list/model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MandateInvestorDataService extends BaseDataService<OfiMandateInvestorService> {
    @select(['ofi', 'ofiMandateInvestor', 'list', 'records']) list$;
    @select(['ofi', 'ofiMandateInvestor', 'list', 'requested']) listRequested$;

    constructor(protected dataService: OfiMandateInvestorService, protected myUserService: MyUserService) {
        super(dataService, myUserService);
    }

    onInit() {
        super.setupData(
            'mandateInvestorList',
            'defaultList',
            this.list$,
            this.listRequested$
        );
    }

    list(): Observable<{ [id: number]: MandateInvestor }> {
        return super.getData('mandateInvestorList');
    }

    listArray(): Observable<MandateInvestor[]> {
        return this.list().pipe(map(i => Object.keys(i).map(k => i[k])));
    }
}
