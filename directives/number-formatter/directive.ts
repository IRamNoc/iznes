import {Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import {MoneyValuePipe} from '../../pipes';

@Directive({selector: '[appNumberFormatter]'})
export class NumberFormatterDirective implements OnInit {

    private el: HTMLInputElement;
    @Input() fractionSize: number;

    constructor(private _elementRef: ElementRef,
                private _moneyValuePipe: MoneyValuePipe) {
        this.el = this._elementRef.nativeElement;
        this.fractionSize = 2;
    }

    ngOnInit() {
        this.el.value = this._moneyValuePipe.transform(this.el.value, this.fractionSize).toString();
    }

    @HostListener('focus', ['$event.target.value'])
    onFocus(value) {
        this.el.value = this._moneyValuePipe.parse(value, this.fractionSize).toString(); // opposite of transform
    }

    @HostListener('blur', ['$event.target.value'])
    onBlur(value) {
        this.el.value = this._moneyValuePipe.transform(value.toString(), this.fractionSize).toString();
    }

}
