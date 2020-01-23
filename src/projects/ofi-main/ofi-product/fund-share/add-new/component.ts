import { take, filter, map } from 'rxjs/operators';
import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { select, NgRedux } from '@angular-redux/store';
import { Observable, Subscription } from 'rxjs';

import {
    setRequestedIznesFunds,
    clearRequestedIznesFunds,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund/fund-list';

import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-add-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewFundShareComponent implements OnInit, OnDestroy {
    fundList: any;
    fundListItems: any[];
    shareList = {};
    shareListItems: any[];
    newFundShareForm: FormGroup;
    fundForm: FormGroup;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListOb: Observable<any>;

    constructor(
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private router: Router,
        private ofiFundService: OfiFundService,
        private ofiFundShareService: OfiFundShareService,
        private route: ActivatedRoute,
        private location: Location,
    ) {
    }

    ngOnInit() {
        this.ofiFundService.getFundList();

        this.initForms();
        this.initSubscriptions();
        this.checkIfFromFund();
    }

    checkIfFromFund() {
        this.route.queryParams.subscribe((params) => {
            if (params.fund) {
                const fundID = parseInt(params.fund, 10);
                this.waitForCurrentFund(fundID);
            }
        });
    }

    waitForCurrentFund(fundID) {
        this.fundListOb.pipe(
            map((fundItems) => {
                return _.find(fundItems, ['fundID', fundID]);
            }),
            filter(fundItem => !!fundItem),
            take(1),
        )
            .subscribe((fundItem) => {
                const newUrl = this.router.createUrlTree([], {
                    queryParams: { fund: null },
                    queryParamsHandling: 'merge',
                });
                this.location.replaceState(this.router.serializeUrl(newUrl));

                this.newFundShareForm.controls['fund'].patchValue([{
                    id: fundItem.fundID,
                    text: fundItem.fundName,
                }]);
            });
    }

    private initForms(): void {
        this.newFundShareForm = new FormGroup({
            fund: new FormControl([]),
            share: new FormControl([]),
        });

        this.fundForm = new FormGroup({
            legalEntity: new FormControl(),
            domicile: new FormControl(),
        });

        this.fundForm.controls.legalEntity.disable();
        this.fundForm.controls.domicile.disable();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.fundListOb.subscribe((navFund) => {
            this.updateFundList(navFund);
        }));
        this.subscriptionsArray.push(this.newFundShareForm.controls.fund.valueChanges.subscribe((fund) => {
            this.updateFundForm(fund);
            if (!fund.length) {
                return;
            }
            this.newFundShareForm.controls.share.setValue([], { emitEvent: false });
        }));
        this.subscriptionsArray.push(
            this.newFundShareForm.controls.share.valueChanges
                .subscribe((share) => {
                    if (!share || !share.length) {
                        return;
                    }
                    const id = share[0].id;
                    const newFundItem = [_.find(this.fundListItems, { id: this.shareList[id] })];
                    this.newFundShareForm.controls.fund.setValue(
                        newFundItem,
                        { emitEvent: false },
                    );
                    this.updateFundForm(newFundItem);
                    this.newFundShareForm.controls.fund.markAsUntouched();
                }),
        );
        this.subscriptionsArray.push(
            this.shareListOb.subscribe((list) => {
                const keys = Object.keys(list);
                if (!keys.length) {
                    this.shareListItems = [];
                    return;
                }

                keys.forEach((key) => {
                    this.shareList[key] = list[key].fundID;
                });

                this.shareListItems = keys.map((key) => {
                    return {
                        id: key,
                        text: list[key].fundShareName,
                    };
                });
            }),
        );
    }

    private updateFundForm(fund): void {
        if (!fund.length) {
            this.fundForm.setValue({
                legalEntity: null,
                domicile: null,
            });
            return;
        }
        const fundObj = _.find(this.fundList, (fundItem) => {
            return fundItem.fundID === fund[0].id;
        });

        const legalEntity = fundObj.legalEntityIdentifier ? fundObj.legalEntityIdentifier : 'N/A';
        this.fundForm.controls.legalEntity.patchValue(legalEntity);
        this.fundForm.controls.domicile.patchValue(fundObj.domicile);
    }

    /**
     * get the fund list
     * @param navList NavList
     * @return void
     */
    private updateFundList(fundList: any): void {
        const filteredFundList = {};
        Object.keys(fundList).forEach((key) => {
            if (fundList[key].draft == 0) filteredFundList[key] = fundList[key];
        });

        this.fundList = filteredFundList ? filteredFundList : undefined;
        this.fundListItems = filteredFundList ? this.processFundList(filteredFundList) : undefined;

        if (this.fundList) this.redux.dispatch(setRequestedIznesFunds());

        this.changeDetectorRef.markForCheck();
    }

    private processFundList(fundList): any[] {
        const arr = [];

        _.forEach(fundList, (fund) => {
            arr.push({
                id: fund.fundID,
                text: fund.fundName,
            });
        });

        return arr;
    }

    selectFund(): void {
        if (!this.isValid) return;

        const selectedFundId = _.get(this.newFundShareForm.value.fund, [0, 'id'], false);

        const params = this.newFundShareForm.value.share.length
            ? `?prefill=${this.newFundShareForm.value.share[0].id}`
            : `?fund=${selectedFundId}`;

        const url = `product-module/product/fund-share${params}`;

        this.router.navigateByUrl(url);
    }

    isValid(): boolean {
        return this.newFundShareForm.valid || this.newFundShareForm.controls.share.value.length > 0;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
