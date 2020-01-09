import {AfterViewInit, Directive, ElementRef, Renderer2, HostListener, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Directive({selector: '[clrDgRowClickable]'})
export class ClrDgRowClickableDirective implements AfterViewInit {

    private rows: any;

    constructor(
        private _elementRef: ElementRef,
        private renderer: Renderer2,
    ) {
    }

    ngAfterViewInit() {
        this.renderer.setStyle(this._elementRef.nativeElement, 'cursor', 'pointer');
    }
}
