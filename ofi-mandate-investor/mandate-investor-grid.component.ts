import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MandateInvestorDataService } from '../ofi-data-service/mandate-investor/ofi-mandate-investor-data.service';
import { select } from '@angular-redux/store';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { OfiPortfolioMangerService } from '../ofi-req-services/ofi-portfolio-manager/service';
import { MultilingualService } from '@setl/multilingual';
import { ConfirmationService } from '@setl/utils';
import { InvestorType } from '../shared/investor-types';

@Component({
    selector: 'app-mandate-investor-grid',
    templateUrl: 'mandate-investor-grid.component.html',
})
export class MandateInvestorGridComponent implements OnInit {

    list$;
    portfolioManager$;
    pendingChanges = [];
    list = [];

    @Input('pm') pm;
    @Output('toggle') toggle = new EventEmitter();
    @Output('manageAccess') manageAccess = new EventEmitter();
    @select(['ofi', 'ofiPortfolioManager', 'portfolioManagerList', 'portfolioManagerList']) portfolioManagers$;

    constructor(
        private dataService: MandateInvestorDataService,
        private location: Location,
        private toaster: ToasterService,
        private ofiPmService: OfiPortfolioMangerService,
        private language: MultilingualService,
        private confirmationService: ConfirmationService,
    ) { }

    ngOnInit() {
        this.portfolioManager$ = this.portfolioManagers$
            .pipe(map(pms => pms[this.pm.pmId]));
        this.list$ = combineLatest(this.dataService.listArray(), this.portfolioManager$)
            .pipe(map(([investors, pm]) => {
                const list = investors.map((inv) => {
                    let status = false;
                    if (inv.id in pm.mandateInvestors) {
                        status = pm.mandateInvestors[inv.id].status;
                    }
                    return {
                        ...inv,
                        investorName: (inv.investorType === InvestorType.RetailMandate) ? `${inv.firstName} ${inv.lastName}` : inv.companyName,
                        status,
                        pmId: pm.pmId,
                        statusControl: new FormControl(status),
                    };
                });
                this.list = list;
                return list;
            }));
    }

    handleChange() {
        this.pendingChanges = this.list
            .filter(investor => investor.status !== investor.statusControl.value)
            .map(investor => ({
                investorId: investor.id,
                firstName: investor.firstName,
                lastName: investor.lastName,
                investorName: investor.investorName,
                pmId: investor.pmId,
                status: investor.statusControl.value,
            }));
    }

    handleManageAccess(item) {
        this.manageAccess.emit(item);
    }

    confirmSave() {
        const message = this.pendingChanges.length === 0
            ? this.language.translate('No changes have been made to the Portfolio Manager\'s Investor Access permissions.')
            : this.language.translate('Please confirm the changes made to the Portfolio Manager\'s Investor Access permissions.');

        this.confirmationService.create(this.language.translate('Confirm Investor Access:'), message, {
            confirmText: this.language.translate('Confirm Access and Save Changes'),
            declineText: this.language.translate('Cancel'),
            btnClass: 'primary',
        }).subscribe((ans) => {
            if (ans.resolved) {
                this.saveAccess();
            }
        });
    }

        /**
     * make request to server to update fund accesses.
     */
    saveAccess() {
        const requests = this.pendingChanges.map((accessChange) => {
            return this.ofiPmService.updateWealthManagerInvestorAccess({
                pmId: accessChange.pmId,
                investorId: accessChange.investorId,
                status: accessChange.status ? 1 : 0,
            });
        });

        Promise.all(requests).then(() => {
            this.pendingChanges = [];
            this.toaster.pop(
                'success',
                this.language.translate(
                    '@emailAddress@\'s fund authorisation has been successfully updated',
                    { emailAddress: this.pm.emailAddress },
                ),
            );
        });
    }

    backToPmList() {
        this.location.back();
    }
}
