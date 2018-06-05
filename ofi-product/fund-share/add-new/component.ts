import * as _ from 'lodash';
import {Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Location} from '@angular/common';
import {FormGroup, FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {
    setRequestedFund,
    clearRequestedFund,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund/fund-list';
import {
    getOfiFundShareSelectedFund,
    ofiSetCurrentFundShareSelectedFund,
    ofiClearCurrentFundShareSelectedFund
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-sf';

import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-add-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class AddNewFundShareComponent implements OnInit, OnDestroy {

    fundList: any;
    fundListItems: any;
    newFundShareForm: FormGroup;
    fundForm: FormGroup;

    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requested']) fundListRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListOb: Observable<any>;

    constructor(private redux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private ofiFundService: OfiFundService,
                private ofiFundShareService: OfiFundShareService,
                private route: ActivatedRoute,
                private location : Location) {
    }

    ngOnInit() {
        this.initForms();
        this.initSubscriptions();
        this.checkIfFromFund();

        this.redux.dispatch(ofiClearCurrentFundShareSelectedFund());
    }

    checkIfFromFund(){
        this.route.queryParams.subscribe(params => {
            if(params.fund){
                let fundID = parseInt(params.fund);
                this.waitForCurrentFund(fundID);
            }
        });
    }

    waitForCurrentFund(fundID) {
        this.fundListOb
            .map(fundItems => {
                return _.find(fundItems, ['fundID', fundID]);
            })
            .filter(fundItem => !!fundItem)
            .take(1)
            .subscribe(fundItem => {
                let newUrl = this.router.createUrlTree([], {
                    queryParams: { fund: null },
                    queryParamsHandling: "merge"
                });
                this.location.replaceState(this.router.serializeUrl(newUrl));

                this.newFundShareForm.controls['fund'].patchValue([{
                    id : fundItem.fundID,
                    text : fundItem.fundName
                }]);
            });
    }

    private initForms(): void {
        this.newFundShareForm = new FormGroup({
            fund: new FormControl()
        });

        this.fundForm = new FormGroup({
            legalEntity: new FormControl(),
            domicile: new FormControl()
        });

        this.fundForm.controls.legalEntity.disable();
        this.fundForm.controls.domicile.disable();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.fundListRequestedOb.subscribe(requested => {
            this.requestFundList(requested);
        }));
        this.subscriptionsArray.push(this.fundListOb.subscribe(navFund => {
            this.updateFundList(navFund);
        }));
        this.subscriptionsArray.push(this.newFundShareForm.controls.fund.valueChanges.subscribe(fund => {
            this.updateFundForm(fund);
        }));
    }

    private updateFundForm(fund): void {
        const fundObj = _.find(this.fundList, (fundItem) => {
            return fundItem.fundID === fund[0].id;
        });

        const legalEntity = fundObj.legalEntityIdentifier ? fundObj.legalEntityIdentifier : 'N/A';
        this.fundForm.controls.legalEntity.patchValue(legalEntity);
        this.fundForm.controls.domicile.patchValue(fundObj.domicile);
    }

    /**
     * request the fund list
     * @param requested boolean
     * @return void
     */
    private requestFundList(requested: boolean): void {
        if(requested) return;

        OfiFundService.defaultRequestFundList(this.ofiFundService, this.redux);
    }

    /**
     * get the fund list
     * @param navList NavList
     * @return void
     */
    private updateFundList(fundList: any): void {
        this.fundList = fundList ? fundList : undefined;
        this.fundListItems = fundList ? this.processFundList(fundList) : undefined;

        if(this.fundList) this.redux.dispatch(setRequestedFund());

        this.changeDetectorRef.markForCheck();
    }

    private processFundList(fundList): any[] {
        const arr = [];

        _.forEach(fundList, (fund) => {
            arr.push({
                id: fund.fundID,
                text: fund.fundName
            });
        });

        return arr;
    }

    selectFund(): void {
        if(!this.isValid) return;

        const selectedFundId = this.newFundShareForm.value.fund[0].id;

        this.redux.dispatch(ofiSetCurrentFundShareSelectedFund(selectedFundId));

        this.router.navigateByUrl('product-module/product/fund-share');
    }

    isValid(): boolean {
        return this.newFundShareForm.valid;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}