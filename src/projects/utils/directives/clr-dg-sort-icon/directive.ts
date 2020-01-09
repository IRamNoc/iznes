import {AfterViewInit, Directive, ElementRef, HostListener, Input, OnInit} from '@angular/core';
import * as _ from 'lodash';

@Directive({selector: '[clrDgSortIcon]'})
export class ClrDgIconSortDirective implements AfterViewInit {

    private labelEl: any;
    private colums: any;
    private allSort = [];

    constructor(private _elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        // this.labelEl = this._elementRef.nativeElement.getElementsByClassName('column-label');
        // this.colums = this._elementRef.nativeElement.getElementsByClassName('datagrid-column');
        // this.showDefault();
    }

    // @HostListener('click') onClick() {
    //     if (this.labelEl && this.labelEl.length > 1) {
    //         let tmpAllSort = [];
    //         for (let label of this.colums) {
    //             const isDesc = label.classList.contains('desc');
    //             const isAsc = label.classList.contains('asc');
    //             let sort = null;
    //             if (isDesc) {
    //                 sort = 0;
    //             } else if (isAsc) {
    //                 sort = 1;
    //             }
    //             tmpAllSort.push(sort);
    //         }
    //         if (!_.isEqual(this.allSort, tmpAllSort)) {
    //             this.allSort = [];
    //             for (let sort of tmpAllSort) {
    //                 this.allSort.push(sort);
    //             }
    //             this.showDefault();
    //         }
    //     }

    //     if (this.labelEl && this.labelEl.length === 1) {
    //         const isDesc = this._elementRef.nativeElement.classList.contains('desc');
    //         const isAsc = this._elementRef.nativeElement.classList.contains('asc');

    //         if (isDesc) {
    //             this.showDes();
    //         } else if (isAsc) {
    //             this.showAsc();
    //         }
    //     }
    // }

    // private showDefault() {
    //     if (this.labelEl && this.labelEl.length > 1) {
    //         if (this.allSort.length === 0) {
    //             this.allSort.push(null); // fix because 1st time miss one
    //             for (let label of this.colums) {
    //                 this.allSort.push(null);
    //             }
    //         }
    //         let cpt = 0;
    //         for (let label of this.labelEl) {
    //             if (label.tagName === 'SPAN' && this.allSort[cpt + 1] === null) {
    //                 label.innerHTML = '<i class="fa fa-sort" style="font-weight: bolder; padding-left: 10px"></i>';
    //             }
    //             cpt += 1;
    //         }
    //     }
    // }

    // private showDes() {
    //     if (this.labelEl[0] instanceof HTMLElement) {
    //         this.labelEl[0].innerHTML = '<i class="fa fa-sort-down" style="font-weight: bolder; padding-left: 10px"></i>';
    //     }
    // }

    // private showAsc() {
    //     if (this.labelEl[0] instanceof HTMLElement) {
    //         this.labelEl[0].innerHTML = '<i class="fa fa-sort-up" style="font-weight: bolder; padding-left: 10px"></i>';
    //     }
    // }
}
