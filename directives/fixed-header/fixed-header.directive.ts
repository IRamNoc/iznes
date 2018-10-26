import { Directive, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';

@Directive({
    selector: '[fixedHeader]',
})

/* Export directive class. */
export class FixedHeaderDirective implements AfterViewInit, OnDestroy {
    private dg: any;
    private dgHead: any;
    private dgWidth: number;
    private dgHeadHeight: any;
    private distanceFromTop: number;
    private scrollEventOb;

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        // Set up references to the datagrid elements and grab the width and head height
        this.dg = document.querySelector('.datagrid');
        this.dgHead = document.querySelector('.datagrid-head');
        this.dgWidth = this.el.nativeElement.offsetWidth;
        this.dgHeadHeight = this.dgHead.offsetHeight;

        // Subscribe to scroll events on the page
        this.scrollEventOb = Observable.fromEvent(
            this.el.nativeElement.closest('ng-sidebar-container'), 'scroll').subscribe(
            (e: any) => {
                // Work out the datagrid distance from the top of the page
                const scrollPosition = e.srcElement.scrollTop;
                const dgHeight = this.el.nativeElement.offsetTop;
                this.distanceFromTop = (dgHeight - scrollPosition) + 12; // +12px to account for padding on datagrid

                // Toggle the 'fixing' of the datagrid header
                this.fixDatagridHeader();
            },
        );
    }

    /**
     * Resize Datagrid Header
     * ---------------------
     * Listen for window resize, update the dgWidth property and call fixDatagridHeader
     */
    @HostListener('window:resize', ['$event'])
    resizeDatagridHeader() {
        this.dgWidth = this.el.nativeElement.offsetWidth;
        this.fixDatagridHeader();
    }

    /**
     * Fix Datagrid Header
     * -------------------
     * Toggle the 'fixing' of the datagrid header when the page is scrolled
     */
    fixDatagridHeader() {
        if (this.distanceFromTop <= 0) {
            this.dgHead.classList.add('fixed');
            this.dgHead.style.width = `${this.dgWidth}px`;
            this.dg.style.marginTop = `${this.dgHeadHeight}px`;
        } else {
            this.dgHead.classList.remove('fixed');
            this.dgHead.style.width = 'inherit';
            this.dg.style.marginTop = '0';
        }
    }

    ngOnDestroy() {
        // Unsubscribe from observable
        this.scrollEventOb.unsubscribe();
    }
}
