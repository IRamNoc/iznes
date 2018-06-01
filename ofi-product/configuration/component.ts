import {
    Component,
    OnInit, OnDestroy,
    ChangeDetectionStrategy, ChangeDetectorRef,
} from '@angular/core';

@Component({
    selector: 'app-ofi-product-configuration',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class ProductConfigurationComponent implements OnInit, OnDestroy {
    constructor() {}

    ngOnInit() {}

    ngOnDestroy() {}
}
