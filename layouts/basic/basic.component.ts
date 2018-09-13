import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ElementRef,
    Inject,
    HostListener,
    AfterViewInit,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { setVersion } from '@setl/core-store';
import { Subscription } from 'rxjs/Subscription';
import { FadeSlideRight } from '../../animations/fade-slide-right';

import { MyUserService } from '@setl/core-req-services';
import { SagaHelper } from '@setl/utils';
import { SET_LANGUAGE } from '@setl/core-store/user/site-settings/actions';

import { MultilingualService } from '@setl/multilingual';
import { ActivationStart, Router } from '@angular/router';
import { get, isEmpty } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [FadeSlideRight],
})

export class BasicLayoutComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('main') mainEl: ElementRef;
    @ViewChild('sidebar') sidebarEl: ElementRef;

    private appConfig: AppConfig;

    public opened = false;
    public modeNum = 0;
    public positionNum = 1;
    public dock = false;
    public closeOnClickOutside = false;
    public closeOnClickBackdrop = true;
    public showBackdrop = true;
    public animate = true;
    public trapFocus = true;
    public autoFocus = true;
    public keyClose = false;
    public autoCollapseHeight: number = null;
    public autoCollapseWidth: number = null;
    public fixSidebar: boolean = true;
    public fixSidebarBottom: boolean = false;
    public sidebarHeight: number;
    public scrollTopPosition: number;
    public topBarHeight: number = 75; // default topbar height

    /* Redux observables. */
    public _MODES: string[] = ['over', 'push', 'slide'];
    public POSITIONS: string[] = ['left', 'right', 'top', 'bottom'];

    /* Redux observables. */
    @select(['user', 'siteSettings', 'menuShown']) menuShowOb;
    @select(['user', 'siteSettings', 'version']) requestVersionObj;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    public menuShown: number;
    public production: boolean;
    public currentVersion: string;
    public currentLanguage: string;
    public currentParentUrl: string;

    /* Observable subscription array. */
    subscriptionsArray: Subscription[] = [];

    constructor(private ngRedux: NgRedux<any>,
                private myUserService: MyUserService,
                public translate: MultilingualService,
                private router: Router,
                public changeDetectorRef: ChangeDetectorRef,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private http: HttpClient) {

        this.appConfig = appConfig;
        this.production = this.appConfig.production;

        /* If on production build, request current version and save to Redux */
        this.subscriptionsArray.push(this.requestVersionObj.subscribe(version => this.currentVersion = version));
        if (isEmpty(this.currentVersion) && this.production) {
            const version = this.http.get('/VERSION', { responseType: 'text' });
            this.subscriptionsArray.push(version.subscribe((v) => {
                this.ngRedux.dispatch(setVersion(v));
            }));
        }

        /* By default show the menu. */
        this.menuShown = 1;

        /* Subscribe to the menu shown value in redux. */
        this.subscriptionsArray.push(this.menuShowOb.subscribe(
            (menuState) => {
                /* Call menu has changed. */
                this.menuHasChanged(menuState);
            },
        ));

        /* Subscribe to the language flag in redux. */
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe(language => this.getLanguage(language)));

        this.subscriptionsArray.push(router.events.pipe(debounceTime(500)).subscribe((event) => {
            if (event instanceof ActivationStart) {
                // update current ParentUrl, but we excluding the parameter
                this.currentParentUrl = get(event, 'snapshot.routeConfig.path', this.currentParentUrl);
                console.log(this.currentParentUrl);
            }
        }));
    }

    /**
     * On Init.
     */
    ngOnInit() {
        /* Stub. */
    }

    ngAfterViewInit() {
        // Check height of sidebar and if greater than window height remove fixed class
        this.sidebarHeight = this.sidebarEl.nativeElement.clientHeight;
        if (this.sidebarHeight > window.innerHeight) this.fixSidebar = false;

    }

    @HostListener('window:resize', ['$event'])
    /**
     * Handle Sidebar Fixing On Window Resize
     * --------------------------------------
     * Fix the sidebar when the viewport height is greater than it's height, or remove if not
     */
    handleSidebarFixingOnWindowResize() {
        this.sidebarHeight = this.sidebarEl.nativeElement.clientHeight;
        this.fixSidebar = this.sidebarHeight > (window.innerHeight - this.topBarHeight) ? false : true;
    }

    /**
     * Handle Sidebar Fixing On Scroll
     * -------------------------------
     * Fix the sidebar when it's bottom reaches the bottom of the page and remove when scrolled back above this
     *
     * @param event
     */
    handleSidebarFixingOnScroll(event) {
        // Pass scroll information to content scroll area
        this.scrollTopPosition = event.target.scrollTop;
        this.topBarHeight = window.innerHeight - event.target.clientHeight;

        // Set sidebar height for min-height property on content area, plus 20px to avoid scroll bar issues
        this.sidebarHeight = this.sidebarEl.nativeElement.clientHeight + 20;

        // If sidebar is greater than viewport height, fix sidebar when it reaches bottom of the screen or remove if not
        if (this.sidebarHeight > window.innerHeight) {
            this.fixSidebarBottom =
                (this.sidebarHeight - event.target.scrollTop) <= event.target.clientHeight ? true : false;
        }
    }

    /**
     * Handle Sidebar Fixing On Click
     * -------------------------------
     * Unfix the sidebar when a menu item expands to increase it's height to larger than the viewport, or fix if not
     */
    handleSidebarFixingOnClick() {
        // setTimeout to account for CSS transition time before calculating heights
        setTimeout(
            () => {
                // Set sidebar height for min-height property on content area, plus 20px to avoid scroll bar issues
                this.sidebarHeight = this.sidebarEl.nativeElement.clientHeight + 20;
                this.fixSidebar =
                    this.sidebarHeight > (window.innerHeight - this.topBarHeight) ? false : true;
                this.changeDetectorRef.detectChanges();
            },
            200,
        );
    }

    /**
     * Sidebar Scroll
     * --------------
     * Passes the delta information of the wheel event on the sidebar to set the scrollTop position of the content area
     *
     * @param event
     */
    sidebarScroll(event) {
        this.scrollTopPosition += event.deltaY;
    }

    /** Get Language
     * ------------
     * Sets the current language public variable
     *
     * @param language
     */
    getLanguage(language): void {
        this.currentLanguage = language;
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Toggle Sidebar
     * --------------
     * Toggles the open state of the sidebar.
     *
     * @returns {boolean}
     */
    public toggleSidebar() {
        /* Invert the opened state. */
        this.opened = !this.opened;

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
            'fr-Latn',
        ];

        this.translate.updateLanguage(lang);

        // save language in db
        const asyncTaskPipe = this.myUserService.setLanguage({ lang });
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_LANGUAGE],
            [],
            asyncTaskPipe,
            {},
        ));

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

    onDeactivate() {
        const element = this.mainEl.nativeElement;
        element.classList.add('pure-scroll');
        element.scrollTop = 0;
        element.classList.remove('pure-scroll');
    }
}
