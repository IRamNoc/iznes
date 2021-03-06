import { Component, OnInit, Input, Output, ViewChild, EventEmitter, ElementRef, OnDestroy } from '@angular/core';
import { isEmpty, castArray, values, map, toNumber } from 'lodash';
import { select } from '@angular-redux/store';
import { formHelper } from '@setl/utils/helper';
import { Subject } from 'rxjs';
import { filter, map as rxMap, takeUntil, take, distinctUntilChanged } from 'rxjs/operators';
import { FormPercentDirective } from '@setl/utils/directives/form-percent/formpercent';
import { RiskProfileService } from '../risk-profile.service';
import { NewRequestService } from '../../new-request.service';

@Component({
    selector: 'investment-nature',
    templateUrl: './investment-nature.component.html',
})
export class InvestmentNatureComponent implements OnInit, OnDestroy {
    @ViewChild(FormPercentDirective) formPercent: FormPercentDirective;
    @Input() form;
    @Input() completedStep: number;
    @Output() submitEvent: EventEmitter<any> = new EventEmitter<any>();
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) currentlyRequestedKycs$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    unsubscribe: Subject<any> = new Subject();
    open: boolean = false;
    amcs;
    formWatch: Subject<boolean> = new Subject<boolean>();

    constructor(
        private element: ElementRef,
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
        this.requests$
            .pipe(
                filter(requests => !isEmpty(requests)),
                takeUntil(this.unsubscribe),
            )
            .subscribe((requests) => {
                requests.forEach((request) => {
                    this.riskProfileService.getCurrentFormNatureData(request.kycID);
                });
            });

        this.riskProfileService.currentServerData.risknature
            .pipe(
                takeUntil(this.unsubscribe),
                distinctUntilChanged(),
            )
            .subscribe((data: any) => {
                const cross = toNumber(data.naturesSameInvestmentCrossAm);

                if (cross) {
                    this.form.get('naturesSameInvestmentCrossAm').patchValue(cross, { emitEvent: false });
                    this.formCheckSameNatureCrossAm(cross);
                }
            });
    }

    initData() {
        this.currentlyRequestedKycs$
            .pipe(
                takeUntil(this.unsubscribe),
                filter(requestedKycs => !isEmpty(requestedKycs)),
            )
            .subscribe((requestedKycs) => {
                // filter out id2s AMs, because they are required to fill in investment details.
                this.amcs = values(requestedKycs).filter(kyc => kyc.managementCompanyType != 'id2s');
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

    async generateNatures(amcs = []) {
        const natures = await this.newRequestService.createInvestmentNatures(amcs);
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

    isStepValid() {
        return this.form.valid;
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!this.form.valid) {
            formHelper.dirty(this.form);
            formHelper.scrollToFirstError(this.element.nativeElement);
            this.submitEvent.emit({ invalid: true });
            return;
        }

        this.requests$
            .pipe(
                take(1),
            )
            .subscribe((requests) => {
                this.riskProfileService.sendRequestInvestmentNature(this.form, requests)
                    .then(() => {
                        this.submitEvent.emit({
                            completed: true,
                        });
                    })
                    .catch((e) => {
                        this.newRequestService.errorPop(e);
                    })
                    ;
            });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
