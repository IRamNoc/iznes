import { Component, Inject, OnDestroy } from '@angular/core';
import { MultilingualService } from '@setl/multilingual/multilingual.service';
import { Subscription } from 'rxjs/Subscription';
import { NgRedux, select } from '@angular-redux/store';
import { HttpClient } from '@angular/common/http';
import { setVersion } from '@setl/core-store';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';

@Component({
    selector: 'navigation-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class NavigationFooterComponent implements OnDestroy {
    public year: number = new Date().getFullYear();
    private subscriptionsArray: Subscription[] = [];
    public currentVersion: string;
    public platform: string;

    @select(['user', 'siteSettings', 'version']) requestVersionObj;

    constructor(
        public translate: MultilingualService,
        private http: HttpClient,
        private ngRedux: NgRedux<any>,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        /* If on production build, request current version and save to Redux */
        this.subscriptionsArray.push(this.requestVersionObj.subscribe(version => this.currentVersion = version));
        if (!this.currentVersion && appConfig.production) {
            this.subscriptionsArray.push(
                this.http.get('/VERSION', { responseType: 'text' }).subscribe(
                    v => this.ngRedux.dispatch(setVersion(v)),
                    () => console.warn('Unable to get current version'),
                ),
            );
        }

        this.platform = appConfig.platform;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
