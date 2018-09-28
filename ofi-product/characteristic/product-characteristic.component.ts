import { takeUntil } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select } from '@angular-redux/store';
import { Location } from '@angular/common';
import { Subject, combineLatest } from 'rxjs';
import * as _ from 'lodash';

import {
    ProductCharacteristicsService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/product-characteristics/service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { NumberConverterService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';

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

    isin: string;
    legalFormItems = [];
    currentProduct = {
        umbrellaFundName: '',
        fundShareName: '',
        isin: '',
        prospectus: {
            fileID: '',
            hash: '',
            name: '',
        },
        kiid: {
            fileID: '',
            hash: '',
            name: '',
        },
        shareClassCurrency: '',
    };

    unSubscribe: Subject<any> = new Subject();

    @select(['ofi', 'ofiProduct', 'ofiProductCharacteristics', 'product']) productCharacteristics$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencies$;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private location: Location,
        private productCharacteristicsService: ProductCharacteristicsService,
        private currenciesService: OfiCurrenciesService,
        private numConverter: NumberConverterService,
        public translate: MultilingualService,
        @Inject('product-config') productConfig,
    ) {
        this.legalFormItems = productConfig.fundItems.fundLegalFormItems;
        this.currenciesService.getCurrencyList();
    }

    ngOnInit() {
        this.route.params
        .pipe(
            takeUntil(this.unSubscribe)
        )
        .subscribe((params) => {
            if (params.isin) {
                this.productCharacteristicsService.getProductCharacteristics(params.isin);
                this.isin = params.isin;
            }
        });

        combineLatest(this.currencies$, this.productCharacteristics$)
        .pipe(
            takeUntil(this.unSubscribe)
        )
        .subscribe(([c, p]) => {
            const currencies = c.toJS();
            if (!currencies.length || !p.get(this.isin)) {
                return;
            }
            const d = p.get(this.isin).toJS();

            const shareClassCurrency = _.find(currencies, { id: d.shareClassCurrency }).text;
            const prospectus = d.prospectus || '|||';
            const kiid = d.kiid || '|||';
            const legalForm = _.find(this.legalFormItems, { id: d.legalForm }).text;
            const subscriptionSettlementPeriod = d.subscriptionSettlementPeriod === 0 ? 'D' :
                d.subscriptionSettlementPeriod > 0 ? `D+${d.subscriptionSettlementPeriod}` :
                    `D${d.subscriptionSettlementPeriod}`;
            const navPeriodForSubscription = d.navPeriodForSubscription === 0 ? 'D' :
                d.navPeriodForSubscription > 0 ? `D+${d.navPeriodForSubscription}` :
                    `D${d.navPeriodForSubscription}`;
            const redemptionSettlementPeriod = d.redemptionSettlementPeriod === 0 ? 'D' :
                d.redemptionSettlementPeriod > 0 ? `D+${d.redemptionSettlementPeriod}` :
                    `D${d.redemptionSettlementPeriod}`;
            const navPeriodForRedemption = d.navPeriodForRedemption === 0 ? 'D' :
                d.navPeriodForRedemption > 0 ? `D+${d.navPeriodForRedemption}` :
                    `D${d.navPeriodForRedemption}`;

            this.currentProduct = {
                ...d,
                srri: _.get(d.srri, [0, 'text']),
                sri: _.get(d.sri, [0, 'text']),
                distributionPolicy: _.get(d.distributionPolicy, [0, 'text']),
                prospectus: {
                    fileID: prospectus.split('|')[0],
                    hash: prospectus.split('|')[1],
                    name: prospectus.split('|')[2],
                },
                kiid: {
                    fileID: kiid.split('|')[0],
                    hash: kiid.split('|')[1],
                    name: kiid.split('|')[2],
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
                minInitialSubscriptionInAmount: this.numConverter.toFrontEnd(d.minInitialSubscriptionInAmount),
                minSubsequentRedemptionInAmount: this.numConverter.toFrontEnd(d.minSubsequentRedemptionInAmount),
                minInitialSubscriptionInShare: this.numConverter.toFrontEnd(d.minInitialSubscriptionInShare),
                minSubsequentRedemptionInShare: this.numConverter.toFrontEnd(d.minSubsequentRedemptionInShare),
                initialNav: this.numConverter.toFrontEnd(d.initialNav),
                latestNav: this.numConverter.toFrontEnd(d.latestNav),
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

    onClickMoreDetails() {
        switch (this.route.url['value'][0].path) {
        case 'home':
            this.router.navigateByUrl(`home/fund-share/${this.currentProduct['fundShareID']}`);
            break;
        case 'list-of-funds':
            this.router.navigateByUrl(`list-of-funds/0/fund-share/${this.currentProduct['fundShareID']}`);
            break;
        case 'my-orders':
            this.router.navigateByUrl(`order-book/my-orders/fund-share/${this.currentProduct['fundShareID']}`);
            break;
        }
    }
}
