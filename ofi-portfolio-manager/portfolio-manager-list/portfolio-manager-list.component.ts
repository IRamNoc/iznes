import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { OfiPortfolioManagerDataService } from '../../ofi-data-service/portfolio-manager/ofi-portfolio-manager-data.service';
import { Router } from '@angular/router';
import { PortfolioManagerDetail } from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/model';

@AppObservableHandler
@Component({
    templateUrl: './portfolio-manager-list.component.html',
})
export class PortfolioManagerListComponent implements OnInit, OnDestroy {
    portfolioMangerList = [
        {
            emailAddress: 'email@setl.io',
            firstName: 'ming',
            lastName: 'huang',
            status: 'active',
        },
    ];

    constructor(
        private ofiPortfolioManagerDataService: OfiPortfolioManagerDataService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        (<any>this).appSubscribe(this.ofiPortfolioManagerDataService.getPortfolioManagerArrayList(), pmList => this.portfolioMangerList = pmList);
    }

    ngOnDestroy() {
    }

    /**
     * get css class for pm status
     * @param {boolean} isActive
     * @return {'success' | 'default'}
     */
    getStatusClass(isActive: boolean): 'success' | 'default' {
        return isActive ? 'success' : 'default';
    }

    /**
     * Handle pm list click to go to pm detail.
     * @param {PortfolioManagerDetail} pmId
     */
    handleClick(pm: PortfolioManagerDetail): void {
        this.router.navigate(['portfolio-manager', pm.pmId]);
    }

    /**
     * Redirect user to the Portfolio Manager invite component.
     */
    handleInvite() {
        this.router.navigate(['portfolio-manager', 'invite']);
    }
}
