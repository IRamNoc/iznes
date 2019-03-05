import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FadeSlideRight } from '../../animations/fade-slide-right';
import { MultilingualService } from '@setl/multilingual';
import { ActivationStart, Router } from '@angular/router';
import { get } from 'lodash';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';
import { select } from '@angular-redux/store';

@Component({
    selector: 'app-basic-layout',
    templateUrl: './basic.component.html',
    styleUrls: ['./basic.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [FadeSlideRight],
})

export class BasicLayoutComponent implements OnDestroy {
    public currentParentUrl: string;
    public activeAlert: boolean = false;
    public currentLanguage: string;
    private subscriptionsArray: Subscription[] = [];

    @select(['user', 'siteSettings', 'language']) requestLanguageObj;

    constructor(public translate: MultilingualService,
                private router: Router) {

        /* Get language flag in redux. */
        this.subscriptionsArray.push(this.requestLanguageObj.subscribe(language => this.currentLanguage = language));

        /* Get router path */
        this.subscriptionsArray.push(this.router.events.pipe(debounceTime(500)).subscribe((event) => {
            if (event instanceof ActivationStart) {
                // update current ParentUrl, but we excluding the parameter
                this.currentParentUrl = get(event, 'snapshot.routeConfig.path', this.currentParentUrl);
                console.log(this.currentParentUrl);
            }
        }));
    }

    ngOnDestroy() {
        /* Destroy all redux observable subscriptions. */
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
