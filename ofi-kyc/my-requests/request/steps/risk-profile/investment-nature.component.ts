import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { isEmpty, castArray, values, map, toNumber } from 'lodash';
import { select } from '@angular-redux/store';
import { Subject } from 'rxjs';
import { filter, map as rxMap, takeUntil } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RiskProfileService } from '../risk-profile.service';
import { NewRequestService } from '../../new-request.service';

@Component({
    selector: 'investment-nature',
    templateUrl: './investment-nature.component.html',
})
export class InvestmentNatureComponent implements OnInit {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    amcs;

    constructor(
        private newRequestService: NewRequestService,
        private riskProfileService: RiskProfileService,
    ) {
    }

    get natureControls() {
        return this.form.get('natures').controls;
    }

    ngOnInit() {
        this.initData();
        this.initFormCheck();
        this.getCurrentFormData();

        this.updateCrossAM();
    }

    getCurrentFormData() {
        this.riskProfileService.currentServerData.risknature
        .pipe(takeUntil(this.unsubscribe))
        .subscribe((data: any) => {
            const cross = toNumber(data.naturesSameInvestmentCrossAm);

            if (cross) {
                this.form.get('naturesSameInvestmentCrossAm').patchValue(cross, { emitEvent: false });
                this.formCheckSameNatureCrossAm(cross);
            }
        });
    }

    initData(){
        this.currentlyRequestedKycs$
            .pipe(
                takeUntil(this.unsubscribe),
                filter(requestedKycs => !isEmpty(requestedKycs)),
            )
            .subscribe((requestedKycs) => {
                this.amcs = values(requestedKycs);
                this.updateCrossAM();
            });
    }

    updateCrossAM() {
        const value = this.form.get('naturesSameInvestmentCrossAm').value;

        this.formCheckSameNatureCrossAm(value);
    }

    initFormCheck() {
        this.form.get('naturesSameInvestmentCrossAm').valueChanges
            .pipe(takeUntil(this.unsubscribe))
            .subscribe((value) => {
                this.riskProfileService.currentServerData.risknature.next('');
                this.formCheckSameNatureCrossAm(value);
            });
    }

    formCheckSameNatureCrossAm(value) {
        if (value) {
            this.generateNatures();
        } else {
            this.generateNatures(map(this.amcs, 'amcID'));
        }

        this.formPercent.refreshFormPercent();
    }

    generateNatures(amcs = []) {
        const natures = this.newRequestService.createInvestmentNatures(amcs);
        const naturesControl = this.form.get('natures');
        const numberOfControls = naturesControl.length;

        for (let i = numberOfControls; i > 0; i -= 1) {
            naturesControl.removeAt(i - 1);
        }

        natures.forEach((nature) => {
            naturesControl.push(nature);
        });
    }

    refreshForm() {
        this.formPercent.refreshFormPercent();
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
