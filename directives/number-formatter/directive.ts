import {Directive, HostListener, ElementRef, OnInit} from '@angular/core';
import {MoneyValuePipe} from '../../pipes';

@Directive({selector: '[appNumberFormatter]'})
export class NumberFormatterDirective implements OnInit {

    private el: HTMLInputElement;

    constructor(private _elementRef: ElementRef,
                private _moneyValuePipe: MoneyValuePipe) {
        this.el = this._elementRef.nativeElement;
    }

    ngOnInit() {
        this.el.value = this._moneyValuePipe.transform(this.el.value);
    }

    @HostListener('focus', ['$event.target.value'])
    onFocus(value) {
        // this.el.value = this.currencyPipe.parse(value); // opossite of transform
    }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value) {
        this.el.value = this._moneyValuePipe.transform(value);
    }

}
