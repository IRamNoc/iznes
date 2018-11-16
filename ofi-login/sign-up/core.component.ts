import { Component } from '@angular/core';
import { SignupComponent, LoginGuardService, LoginService } from '@setl/core-login';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { setLanguage } from '@setl/core-store';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'ofi-sign-up',
    styleUrls: ['../login/component.scss'],
    templateUrl: './component.html',
    animations: [
        trigger('fadeInOnLoad', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(1600, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
        trigger('fadeIn', [
            transition(':enter', [
                style({ opacity: 0 }),
                animate(500, style({ opacity: 1 })),
            ]),
            state('*', style({ opacity: 1 })),
        ]),
    ],
})
export class OfiCoreSignUpComponent extends SignupComponent {

    private redux: NgRedux<any>;
    private subscriptions: Subscription[] = [];
    public showLogin: boolean = false;
    public showResetTwoFactor: boolean = false;
    public language: string;
    public langLabels = {
        'fr-Latn': 'Francais',
        'en-Latn': 'English',
    };

    @select(['user', 'siteSettings', 'language']) requestLanguage;

    ngAfterViewInit() {
        setTimeout(
            () => {
                this.showLogin = true;
            },
            200,
        );

        this.subscriptions.push(
            this.requestLanguage.subscribe(requested => this.language = requested ? requested : 'English'),
        );
    }

    updateLang(lang: string) {
        this.redux.dispatch(setLanguage(lang));
    }

    getLangs() {
        return Object.keys(this.langLabels);
    }

    getLabel(lang: string): string {
        return this.langLabels[lang];
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
