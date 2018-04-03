import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

import {FundShareTradeCycleModel, TradeCycleModelDropdowns} from './model';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-trade-cycle',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FundShareTradeCycleComponent implements OnInit, OnDestroy {

    private _tradeType: string;
    @Input() set tradeType(value: string) {
        if(!value) return;

        this._tradeType = value;
        this.typeLowercase = this.getTypeFormatted(0);
        this.typeCapitilised = this.getTypeFormatted(1);
    }
    get type(): string {
        return this._tradeType;
    }

    typeLowercase: string;
    typeCapitilised: string;
    model: FundShareTradeCycleModel = new FundShareTradeCycleModel();
    dropdownItems;

    constructor(private changeDetectorRef: ChangeDetectorRef) {
        this.dropdownItems = new TradeCycleModelDropdowns();
    }

    ngOnInit() { }

    private getTypeFormatted(style: TextStyleEnum): string {
        return style === TextStyleEnum.Lowercase ?
            this._tradeType.toLowerCase() :
            this._tradeType.charAt(0).toUpperCase() + this._tradeType.slice(1);
    }

    ngOnDestroy() {
        
    }

}

enum TextStyleEnum {
    Lowercase,
    Capitilised
}