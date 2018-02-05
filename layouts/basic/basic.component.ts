import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {FadeSlideRight} from '../../animations/fade-slide-right';

import {setLanguage} from '@setl/core-store';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [FadeSlideRight],
})

export class BasicLayoutComponent implements OnInit, OnDestroy {
    public _opened = false;
    public _modeNum = 0;
    public _positionNum = 1;
    public _dock = false;
    public _closeOnClickOutside = false;
    public _closeOnClickBackdrop = true;
    public _showBackdrop = true;
    public _animate = true;
    public _trapFocus = true;
    public _autoFocus = true;
    public _keyClose = false;
    public _autoCollapseHeight: number = null;
    public _autoCollapseWidth: number = null;

    /* Redux observables. */
    public _MODES: Array<string> = ['over', 'push', 'slide'];
    public _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

    /* Redux observables. */
    @select(['user', 'siteSettings', 'menuShown']) menuShowOb;
    @select(['user', 'siteSettings', 'language']) languageOb;

    public menuShown: number;
    public currentLanguage: string;

    /* Observable subscription array. */
    subscriptionsArray: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<any>,
                public changeDetectorRef: ChangeDetectorRef) {
        /* By default show the menu. */
        this.menuShown = 1;
        // console.log(this.menuShown);

        /* Subscribe to the menu shown value in redux. */
        this.subscriptionsArray.push(this.menuShowOb.subscribe(
            (menuState) => {
                /* Call menu has changed. */
                this.menuHasChanged(menuState);
            }
        ));

        /* Subscribe to the language flag in redux. */
        this.subscriptionsArray.push(this.languageOb.subscribe(
            (language) => {
                /* Set the current language. */
                this.currentLanguage = language;
            }
        ));
    }

    /**
     * On Init.
     */
    ngOnInit() {
        /* Stub. */
    }

    /**
     * Toggle Sidebar
     * --------------
     * Toggles the open state of the sidebar.
     *
     * @returns {boolean}
     */
    public _toggleSidebar() {
        /* Invert the opened state. */
        this._opened = !this._opened;

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();

        /* Return false. */
        return false;
    }

    /**
     * Changes Language and Stores in Redux (site-settings)
     *
     * @param lang
     */
    public changeLanguage(lang) {
        const validLocales = [
            'en-Latn',
            'fr-Latn'
        ];

        /* Save last language selected by user in localStorage */
        if (validLocales.indexOf(lang) !== -1) {
            if (typeof(Storage) !== 'undefined') {
                localStorage.setItem('lang', lang);
            }
        }

        /* Set the language in redux. */
        this.ngRedux.dispatch(setLanguage(lang));

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
    }

    /**
     * Menu Has Changed
     * ----------------
     * Toggles the menuShow flag.
     *
     * @param menuState
     */
    public menuHasChanged(menuState) {
        /* Invert the menuShown flag. */
        if (menuState) {
            this.menuShown = 1;
        } else {
            this.menuShown = 0;
        }

        /* Mark for check. */
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Is Current Language
     * -------------------
     * Checks if the language matches a string passed in.
     *
     * @param {string} lang
     * @returns {boolean}
     */
    public isCurrentLanguage(lang: string): boolean {
        /* Return the match. */
        return lang === this.currentLanguage;
    }

    public getRouterOutletState(outlet) {
        if (!outlet || !outlet.activated) {
            return;
        }
        return outlet.activatedRoute.snapshot._routerState.url || null;
    }

    /**
     * On Destroy.
     */
    ngOnDestroy() {
        /* Destroy all redux observable subscriptions. */
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
