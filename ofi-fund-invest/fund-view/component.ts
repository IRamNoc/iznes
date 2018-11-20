import {
    Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output,
    ChangeDetectorRef, OnDestroy,
} from '@angular/core';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

@Component({
    selector: 'app-fund-view',
    templateUrl: 'component.html',
    styleUrls: ['./component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FundViewComponent implements OnInit, OnDestroy {
    @Input() shareId: number;
    @Output() close: EventEmitter<any> = new EventEmitter();

    // List of observable subscription.
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) shareDataOb;

    categories: Array<string>;

    metaData: any;

    activeTabData: any;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        // List of observable subscription.
        this.subscriptionsArray.push(this.shareDataOb.subscribe((shareData) => {
            this.updateShareData(shareData);
            this.metaData = _.get(shareData, [this.shareId, 'metaData'], {});
        }));

        this.categories = ['administrative', 'services', 'category', 'legal', 'fees', 'risk', 'profile', 'characteristic', 'calendar', 'documents'];

        this.activeTabData = {
            category: 'administrative',
        };
        // fundDocDici fundDocProductSheet fundProspectus fundReport
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    updateShareData(shareData) {
    }

    handleClose() {
        this.close.emit();
    }

    tabClick(category) {
        this.activeTabData = {
            category,
        };

        this.changeDetectorRef.markForCheck();
    }
}
