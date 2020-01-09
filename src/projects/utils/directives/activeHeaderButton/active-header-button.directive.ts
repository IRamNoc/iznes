import { Directive, ElementRef, Input, Renderer2, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Directive({
    selector: '[appActiveHeaderButton]'
})
export class ActiveHeaderButtonDirective implements OnDestroy {

    @Input('url') url: any;

    /* Private properties. */
    private subscriptions: Array<any> = [];

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private router: Router,
    ) {

    }

    ngOnInit() {
        this.router.events.subscribe((val) => {
            if (val instanceof NavigationEnd) {
                if (val.urlAfterRedirects === this.url) {
                    this.el.nativeElement.classList.add('nav-button-active');
                } else {
                    this.el.nativeElement.classList.remove('nav-button-active');
                }
            }
        });
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
