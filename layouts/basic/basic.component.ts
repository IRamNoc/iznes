import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
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
export class BasicLayoutComponent implements OnInit {
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

    public _MODES: Array<string> = ['over', 'push', 'slide'];
    public _POSITIONS: Array<string> = ['left', 'right', 'top', 'bottom'];

    @select(['user', 'siteSettings', 'menuShown']) menuShowOb;
    @select(['user', 'siteSettings', 'language']) languageOb;

    public menuShown: number;
    public currentLanguage: string;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    constructor(private ngRedux: NgRedux<any>) {
        this.menuShown = 1;
        console.log(this.menuShown);

        this.subscriptionsArray.push(this.menuShowOb.subscribe(
            (menuState) => {
                this.menuHasChanged(menuState);
            }
        ));

        this.subscriptionsArray.push(this.languageOb.subscribe(
            (language) => {
                this.currentLanguage = language;
            }
        ));
    }

    public _toggleSidebar() {
        this._opened = !this._opened;
        return false;
    }

    /**
     * Changes Language and Stores in Redux (site-settings)
     *
     * @param lang
     */
    public changeLanguage(lang) {
        this.ngRedux.dispatch(setLanguage(lang));
    }

    public menuHasChanged(menuState) {
        if (menuState) {
            this.menuShown = 1;
        } else {
            this.menuShown = 0;
        }
    }

    public isCurrentLanguage(lang: string): boolean {
        return lang === this.currentLanguage;
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
