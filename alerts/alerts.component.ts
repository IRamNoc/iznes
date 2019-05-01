import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject} from '@angular/core';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { Subscription } from 'rxjs/Subscription';
import { select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';
import { JourneyService } from '@setl/utils/helper/journey-service/journey.service';
@Component({
    styleUrls: ['./alerts.component.scss'],
    selector: 'alerts',
    templateUrl: './alerts.component.html',
    providers: [JourneyService],
})

export class AlertsComponent implements AfterViewInit, OnDestroy {

    public appConfig: AppConfig;
    public showAlert: boolean = false;
    public alerts = [];
    public totalAlerts: number = 0;
    public currentAlert: number = 0;
    public mainClass = [];

    private subscriptions: Subscription[] = [];

    @select(['user', 'alerts', 'alerts']) getAlert$;

    constructor(public changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private userService: MyUserService,
                private journeyService: JourneyService,
                @Inject(APP_CONFIG) appConfig: AppConfig) {

        this.appConfig = appConfig;
        this.appConfig.platform = !this.appConfig.platform ? 'OpenCSD' : this.appConfig.platform;
    }

    ngAfterViewInit() {
        this.subscriptions.push(this.getAlert$
        .subscribe(
            (data) => {
                this.alerts = [];
                this.currentAlert = 0;
                Object.keys(data).forEach((alert) => {
                    this.alerts.push(data[alert]);
                });
                this.changeClasses();
            },
        ));
    }

    buttonClick() {
        if (this.alerts[this.currentAlert]['buttonPath'] === 'markAsRead') {
            this.userService.markAlertAsRead(this.alerts[this.currentAlert]['alertID']);
        } else {

            /* Start a journey... */
            if (!!this.alerts[this.currentAlert]['journeyMeta']) {
                this.journeyService.startJourney(
                    'alertJourney',
                    this.alerts[this.currentAlert]['journeyMeta'],
                );
            }

            this.router.navigateByUrl(this.alerts[this.currentAlert]['buttonPath']);
        }
    }

    closeButtonClick() {
        this.userService.markAlertAsRead(this.alerts[this.currentAlert]['alertID']);
    }

    changeClasses() {
        this.mainClass = [];
        if (this.alerts.length > 0) this.mainClass.push(this.alerts[this.currentAlert]['class']);
    }

    changeAlert(dir) {
        this.currentAlert = this.currentAlert + (dir === 'up' ? 1 : -1);
        if (this.currentAlert < 0) this.currentAlert = this.alerts.length - 1;
        if (this.currentAlert >= this.alerts.length) this.currentAlert = 0;
        this.changeClasses();
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
        this.changeDetectorRef.detach();
    }
}
