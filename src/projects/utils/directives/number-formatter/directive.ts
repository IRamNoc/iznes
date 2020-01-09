import * as _ from 'lodash';
import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import { NgControl } from "@angular/forms";
import {MoneyValuePipe} from '../../pipes';

@Directive({selector: '[appNumberFormatter]'})
export class NumberFormatterDirective implements OnInit {

    private el: HTMLInputElement;
    private keypressRegexp: RegExp;
    @Input() fractionSize: number;
    @Input('appNumberFormatter') decimalSize: number;
    private inputValue: string;

    constructor(private _elementRef: ElementRef,
                private control: NgControl,
                private _moneyValuePipe: MoneyValuePipe) {
        this.el = this._elementRef.nativeElement;
        this.fractionSize = 2;
    }

    isCharValid(char: string): boolean {
        return /^(\d|\.|\,)$/.test(char);
    }

    getDecimalPartLength(numberAsString: string): number {
        return _.get(numberAsString.split('.'), [1, 'length'], 0);
    }

    ngOnInit() {
        this.el.value = this._moneyValuePipe.transform(this.el.value, this.fractionSize).toString();

        if (this.decimalSize <= 0) {
            this.keypressRegexp = new RegExp(`^\\d*$`);
        } else {
            this.keypressRegexp = new RegExp(`^\\d*(\\.(\\d{1,${this.decimalSize}})?)?$`);
        }
    }

    @HostListener('focus', ['$event'])
    onFocus(e) {
        if (e.target.tagName === 'INPUT') {
            this.el.value = e.target.value.toString().replace(/\s+/g, '');
            return;
        }
        this.el.value = this._moneyValuePipe.parse(e.target.value, this.fractionSize).toString(); // opposite of transform
    }

    @HostListener('keypress', ['$event'])
    onKeypress(e) {

        const newValue = e.target.value.replace(/\,/, '\.');

        if (!this.isCharValid(e.key)) {
            e.preventDefault();
        }

        this.inputValue = newValue;

    }

    @HostListener('keyup', ['$event'])
    onKeyUp(e) {
        const newValue = e.target.value.replace(/\,/, '\.');

        if (!this.keypressRegexp.test(newValue)
            || this.getDecimalPartLength(newValue) > this.decimalSize
        ) {
            this.control.control.setValue(this.inputValue);
        } else {
            this.control.control.setValue(newValue);
        }
        e.preventDefault();

    }

    @HostListener('blur', ['$event'])
    onBlur(e) {
        const v = e.target.value.toString().replace(/\s+/g, '');
        const fValue = this._moneyValuePipe.transform(v, this.decimalSize || this.fractionSize).toString();

        if (e.target.tagName === 'INPUT') {
            this.control.control.setValue(fValue);
            return;
        }
        this.el.value = fValue;
    }

}
