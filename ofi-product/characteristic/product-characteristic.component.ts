import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { select } from '@angular-redux/store';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { combineLatest } from 'rxjs/observable/combineLatest';
import * as _ from 'lodash';

import {
    ProductCharacteristicsService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/product-characteristics/service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { NumberConverterService } from '@setl/utils';

import {
    StatusEnum,
    ValuationFrequencyEnum,
    TradeCyclePeriodEnum,
    SubscriptionCategoryEnum,
} from '@ofi/ofi-main/ofi-product/fund-share/FundShareEnum';

@Component({
    templateUrl: './product-characteristic.component.html',
    styleUrls: ['./product-characteristic.component.scss'],
})
export class ProductCharacteristicComponent implements OnInit, OnDestroy {

    panels = {
        1: true,
        2: false,
        3: false,
        4: false,
    };

    legalFormItems = [];
    currentProduct = {
        fundShareName: '',
        isin: '',
        prospectus: {
            id: '',
            hash: '',
            filename: '',
        },
        kiid: {
            id: '',
            hash: '',
            filename: '',
        },
        shareClassCurrency: '',
    };

    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiProduct', 'ofiProductCharacteristics', 'product']) productCharacteristics$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencies$;

    constructor(
        private route: ActivatedRoute,
        private location: Location,
        private productCharacteristicsService: ProductCharacteristicsService,
        private currenciesService: OfiCurrenciesService,
        private numConverter: NumberConverterService,
        @Inject('product-config') productConfig,
    ) {
        this.legalFormItems = productConfig.fundItems.fundLegalFormItems;
        this.currenciesService.getCurrencyList();
    }

    ngOnInit() {
        this.route.params
            .takeUntil(this.unSubscribe)
            .subscribe((params) => {
                if (params.isin) {
                    this.productCharacteristicsService.getProductCharacteristics(params.isin);
                }
            });

        combineLatest(this.currencies$, this.productCharacteristics$)
            .takeUntil(this.unSubscribe)
            .subscribe(([c, p]) => {
                const currencies = c.toJS();
                const d = p.toJS();

                if (!currencies.length || !Object.keys(d).length) {
                    return;
                }

                const shareClassCurrency = _.find(currencies, { id: d.shareClassCurrency }).text;
                const prospectus = d.prospectus || '|||';
                const kiid = d.kiid || '|||';
                const legalForm = _.find(this.legalFormItems, { id: d.legalForm.toString() }).text;
                const subscriptionSettlementPeriod = d.subscriptionSettlementPeriod === 0 ? 'D' :
                    `D+${d.subscriptionSettlementPeriod}`;
                const navPeriodForSubscription = d.navPeriodForSubscription === 0 ? 'D' :
                    `D+${d.navPeriodForSubscription}`;
                const redemptionSettlementPeriod = d.redemptionSettlementPeriod === 0 ? 'D' :
                    `D+${d.redemptionSettlementPeriod}`;
                const navPeriodForRedemption = d.navPeriodForRedemption === 0 ? 'D' :
                    `D+${d.navPeriodForRedemption}`;

                this.currentProduct = {
                    ...d,
                    srri: _.get(d.srri, [0, 'text']),
                    sri: _.get(d.sri, [0, 'text']),
                    distributionPolicy: _.get(d.distributionPolicy, [0, 'text']),
                    prospectus: {
                        id: prospectus.split('|')[0],
                        hash: prospectus.split('|')[1],
                        filename: prospectus.split('|')[2],
                    },
                    kiid: {
                        id: kiid.split('|')[0],
                        hash: kiid.split('|')[1],
                        filename: kiid.split('|')[2],
                    },
                    legalForm,
                    shareClassCurrency,
                    status: d.status === 2 ? 'No' : StatusEnum[d.status],
                    valuationFrequency: ValuationFrequencyEnum[d.valuationFrequency],
                    subscriptionTradeCyclePeriod: TradeCyclePeriodEnum[d.subscriptionTradeCyclePeriod],
                    redemptionTradeCyclePeriod: TradeCyclePeriodEnum[d.redemptionTradeCyclePeriod],
                    subscriptionSettlementPeriod,
                    navPeriodForSubscription,
                    subscriptionCategory: SubscriptionCategoryEnum[d.subscriptionCategory],
                    redemptionSettlementPeriod,
                    navPeriodForRedemption,
                    redemptionCategory: SubscriptionCategoryEnum[d.redemptionCategory],
                    maxManagementFee: this.numConverter.toFrontEnd(d.maxManagementFee),
                    maxSubscriptionFee: this.numConverter.toFrontEnd(d.maxSubscriptionFee),
                    maxRedemptionFee: this.numConverter.toFrontEnd(d.maxRedemptionFee),
                    minInitialSubscriptionInShare: this.numConverter.toFrontEnd(d.minInitialSubscriptionInShare),
                    minSubsequentRedemptionInShare: this.numConverter.toFrontEnd(d.minSubsequentRedemptionInShare),
                };

            });

    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    onClickBack() {
        this.location.back();
    }
}
