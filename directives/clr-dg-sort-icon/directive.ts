import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({selector: '[clrDgSortIcon]'})
export class ClrDgIconSortDirective implements AfterViewInit {

    private el: HTMLInputElement;
    @Input() fractionSize: number;
    private labelEl: HTMLElement;


    constructor(private _elementRef: ElementRef) {
        this.fractionSize = 2;
        this.el = this._elementRef.nativeElement;
    }

    ngAfterViewInit() {
        this.labelEl = this._elementRef.nativeElement.getElementsByClassName('column-label')[0];
        this.showDefault();
    }

    @HostListener('click', ['$event'])
    clickEventHandler() {
        const isDesc = this._elementRef.nativeElement.classList.contains('desc');
        const isAsc = this._elementRef.nativeElement.classList.contains('asc');

        if (isDesc) {
            this.showDes();
        } else if (isAsc) {
            this.showAsc();
        } else {
            this.showDefault();
        }
    }

    private showDefault() {
        if (this.labelEl instanceof HTMLElement)
            this.labelEl.innerHTML = '<i class="fa fa-sort" style="font-weight:bolder; padding-left: 10px"></i>';
    }

    private showDes() {
        if (this.labelEl instanceof HTMLElement)
            this.labelEl.innerHTML = '<i class="fa fa-sort-down" style="font-weight:bolder; padding-left: 10px"></i>';
    }

    private showAsc() {
        if (this.labelEl instanceof HTMLElement)
            this.labelEl.innerHTML = '<i class="fa fa-sort-up" style="font-weight:bolder; padding-left: 10px"></i>';
    }
}
