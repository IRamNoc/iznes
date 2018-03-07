import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';

@Directive({selector: '[clrDgSortNoSearch]'})
export class ClrDgSortNoSearchDirective implements AfterViewInit {

    private el: HTMLInputElement;

    constructor(private _elementRef: ElementRef) {
        this.el = this._elementRef.nativeElement;
    }

    ngAfterViewInit() {

        var parent = this.el.getElementsByTagName('clr-dg-filter')[0];
        var child = parent.getElementsByClassName('datagrid-filter-toggle')[0];

        parent.removeChild(child);
    }
}