import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    ViewChild,
    ElementRef,
    Inject,
} from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { setVersion } from '@setl/core-store';
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

import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [FadeSlideRight],
})

export class BasicLayoutComponent implements OnDestroy {
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

    /* Redux observables. */
    public _MODES: string[] = ['over', 'push', 'slide'];
    public POSITIONS: string[] = ['left', 'right', 'top', 'bottom'];

    /* Redux observables. */
    @select(['user', 'siteSettings', 'version']) requestVersionObj;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    public menuShown: number;
    public production: boolean;
    public currentVersion: string;
    public currentLanguage: string;
    public currentParentUrl: string;

    public activeAlert: boolean = false;

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
