import {
    Component,
    OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { Observable ,  Subscription } from 'rxjs';
import { ToasterService } from 'angular2-toaster';

import { ProductConfigTypes } from './Configuration';
import {
    OfiProductConfigService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/configuration/service';
import {
    ProductConfiguration,
    setRequestedConfiguration,
    clearRequestedConfiguration,
} from '@ofi/ofi-main/ofi-store/ofi-product';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-ofi-product-configuration',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: ['.btn { margin-top: 20px; }'],
})

export class ProductConfigurationComponent implements OnInit, OnDestroy {
    dates: () => string[];

    @select([
        'ofi', 'ofiProduct', 'ofiProductConfiguration', 'requestedConfiguration',
    ]) configRequestedOb: Observable<any>;
    @select([
        'ofi', 'ofiProduct', 'ofiProductConfiguration', 'configuration',
    ]) configOb: Observable<any>;

    private subscriptionsArray: Subscription[] = [];
    config: ProductConfiguration;

    constructor(private service: OfiProductConfigService,
                private redux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private toaster: ToasterService,
                public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        this.initSubscriptions();
        this.redux.dispatch(clearRequestedConfiguration());
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.configRequestedOb
            .subscribe((requested: boolean) => {
                this.requestConfig(requested);
            }));
        this.subscriptionsArray.push(this.configOb
            .subscribe((config: ProductConfiguration) => {
                this.updateConfig(config);
            }));
    }

    /**
     * request the product config
     * @param requested boolean
     * @return void
     */
    private requestConfig(requested: boolean): void {
        if (requested) return;

        OfiProductConfigService.defaultRequestProductConfig(this.service, this.redux);
    }

    /**
     * get the product config
     * @param config ProductConfiguration
     * @return void
     */
    private updateConfig(config: ProductConfiguration): void {
        if (!config.holidayManagement.dates) return;

        this.config = config;

        this.redux.dispatch(setRequestedConfiguration());
        this.changeDetectorRef.detectChanges();
    }

    getDates(dates: () => string[]): void {
        this.dates = dates;
    }

    saveConfiguration(): void {
        OfiProductConfigService.defaultUpdateProductConfig(
            this.service,
            this.redux,
            ProductConfigTypes.HolidayManagement,
            JSON.stringify(this.dates()),
            (data: any) => this.onCreateSuccess(),
            (e: any) => this.onCreateError(e[1].Data[0]));
    }

    private onCreateSuccess(): void {
        this.redux.dispatch(clearRequestedConfiguration());

        this.toaster.pop('success', this.translate.translate('Product Configuration saved successfully'));
    }

    private onCreateError(e): void {
        this.toaster.pop('error', this.translate.translate('ERROR') + ': ' + e.Message);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
