import {Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';

import {
    setLanguage
} from '@setl/core-store';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class BasicLayoutComponent implements OnInit, OnDestroy {
    public _opened: boolean = false;
    public _modeNum: number = 0;
    public _positionNum: number = 1;
    public _dock: boolean = false;
    public _closeOnClickOutside: boolean = false;
    public _closeOnClickBackdrop: boolean = true;
    public _showBackdrop: boolean = true;
    public _animate: boolean = true;
    public _trapFocus: boolean = true;
    public _autoFocus: boolean = true;
    public _keyClose: boolean = false;
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

    constructor(
        private ngRedux: NgRedux<any>,
        public changeDetectorRef: ChangeDetectorRef
    ) {
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
