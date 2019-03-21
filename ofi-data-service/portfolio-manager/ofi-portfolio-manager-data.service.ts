import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { BaseDataService, MyUserService } from '@setl/core-req-services';
import { Observable } from 'rxjs/Rx';
import { OfiPortfolioMangerService } from '../../ofi-req-services/ofi-portfolio-manager/service';
import {
    PortfolioManagerDetail,
    PortfolioManagerList,
} from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/model';
import { map } from 'rxjs/operators';

@Injectable()
export class OfiPortfolioManagerDataService extends BaseDataService<OfiPortfolioMangerService> {
    @select(['ofi', 'ofiPortfolioManager', 'portfolioManagerList', 'portfolioManagerList']) portfolioManagerList$;
    @select(['ofi', 'ofiPortfolioManager', 'portfolioManagerList', 'requested']) portfolioManagerListRequested$;

    constructor(protected dataService: OfiPortfolioMangerService, protected myUserService: MyUserService) {
        super(dataService, myUserService);
    }

    onInit() {
        this.setupData(
            'portfolioManagerList',
            'defaultRequestPortpolioManagerList',
            this.portfolioManagerList$,
            this.portfolioManagerListRequested$
        );
    }

    /**
     * Get portfolio manager list in map format
     * @return {Observable<PortfolioManagerList>}
     */
    getPortfolioManagerList(): Observable<PortfolioManagerList> {
        return super.getData<PortfolioManagerList>('portfolioManagerList');
    }

    /**
     * Get portfolio manager list in array format
     * @return {Observable<PortfolioManagerDetail[]>}
     */
    getPortfolioManagerArrayList(): Observable<PortfolioManagerDetail[]> {
        return super.getData<PortfolioManagerList>('portfolioManagerList')
        .pipe(
            map((pms: PortfolioManagerList) => {
                const pmList = [];
                for (const key in pms) {
                    pmList.push(pms[key]);
                }
                return pmList;
            }),
        );
    }
}
