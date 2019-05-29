import { Directive, ElementRef, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/fromEvent';

@Directive({
    selector: '[fixedHeader]',
})

/* Export directive class. */
export class FixedHeaderDirective implements AfterViewInit, OnDestroy {
    private dgHead: any;
    private dgWidth: number;
    private distanceFromTop: number;
    private topbarsHeight: number;
    private scrollEventOb;
    private cssPosition: string;

    constructor(private el: ElementRef) {
    }

    ngAfterViewInit() {
        this.dgHead = this.el.nativeElement.querySelector('.datagrid-header');

        // Grab css position of dgHead so it can be restored
        this.cssPosition = this.dgHead.style.position || 'initial';

        // Subscribe to scroll events on the page
        this.scrollEventOb = Observable.fromEvent(
            document.querySelector('main.content-area'), 'scroll').subscribe(
            (e: any) => {
                // Work out the datagrid distance from the top of the page
                const scrollPosition = e.srcElement.scrollTop;
                const dgHeight = this.el.nativeElement.offsetTop;
                const topbarHeight = document.querySelector('app-navigation-topbar')
                    ? (document.querySelector('app-navigation-topbar') as HTMLElement).offsetHeight : 0;
                const appAlertsHeight = document.querySelector('alerts')
                    ? (document.querySelector('alerts') as HTMLElement).offsetHeight : 0;
                this.topbarsHeight = topbarHeight + appAlertsHeight;

                this.distanceFromTop = (dgHeight - scrollPosition) - this.topbarsHeight;

                // Toggle the 'fixing' of the datagrid header
                this.fixDatagridHeader();
            },
        );
    }

    /**
     * Resize Datagrid Header
     * ---------------------
     * Listen for window resize and call fixDatagridHeader
     */
    @HostListener('window:resize', ['$event'])
    resizeDatagridHeader() {
        this.fixDatagridHeader();
    }

    /**
     * Fix Datagrid Header
     * -------------------
     * Toggle the 'fixing' of the datagrid header when the page is scrolled
     */
    fixDatagridHeader() {
        this.dgWidth = this.el.nativeElement.offsetWidth;

        if (this.distanceFromTop <= 0) {
            this.dgHead.style.position = 'fixed';
            this.dgHead.style.width = `${this.dgWidth - 2}px`;
            this.dgHead.style.marginTop = `${this.topbarsHeight}px`;
        } else {
            this.dgHead.style.position = this.cssPosition;
            this.dgHead.style.width = 'inherit';
            this.dgHead.style.marginTop = '0';
        }
    }

    ngOnDestroy() {
        // Unsubscribe from observable
        this.scrollEventOb.unsubscribe();
    }
}
