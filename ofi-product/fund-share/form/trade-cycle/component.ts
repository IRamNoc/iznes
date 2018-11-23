import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { FundShareTradeCycleModel, TradeCycleModelDropdowns } from './model';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-trade-cycle',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundShareTradeCycleComponent implements OnInit, OnDestroy {
    private _tradeType: string;
    @Input() set tradeType(value: string) {
        if (!value) return;

        this._tradeType = value;
        this.typeLowercase = this.getTypeFormatted(0);
        this.typeCapitilised = this.getTypeFormatted(1);
    }
    get type(): string {
        return this._tradeType;
    }
    @Output() modelEmitter: EventEmitter<FundShareTradeCycleModel> = new EventEmitter();

    typeLowercase: string;
    typeCapitilised: string;
    model: FundShareTradeCycleModel;

    constructor(private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.model = new FundShareTradeCycleModel();
        this.model.addMonthlyDealingDays();
        this.model.addYearlyDealingDays();

        this.modelEmitter.emit(this.model);
    }

    // this is to enforce proper re-render for fund holidays management in the share form component
    markForCheck() {
        this.changeDetectorRef.markForCheck();
    }

    getControls(controlName: string) {
        return (this.model.form.controls[controlName] as FormArray).controls;
    }

    addMonthlyDealingDays(): void {
        this.model.addMonthlyDealingDays();
    }

    removeMonthlyDealingDays(index: number): void {
        this.model.removeMonthlyDealingDays(index);
    }

    addYearlyDealingDays(): void {
        this.model.addYearlyDealingDays();
    }

    removeYearlyDealingDays(index: number): void {
        this.model.removeYearlyDealingDays(index);
    }

    showAdd(index: number, len: number): boolean {
        return index + 1 === len;
    }

    showRemove(index: number, len: number): boolean {
        return len > 1;
    }

    private getTypeFormatted(style: TextStyleEnum): string {
        return style === TextStyleEnum.Lowercase ?
            this._tradeType.toLowerCase() :
            this._tradeType.charAt(0).toUpperCase() + this._tradeType.slice(1);
    }

    ngOnDestroy() {
        this.model = undefined;
    }
}

enum TextStyleEnum {
    Lowercase,
    Capitilised,
}
