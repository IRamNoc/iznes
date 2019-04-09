import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject} from '@angular/core';
import { APP_CONFIG } from '@setl/utils/appConfig/appConfig';
import { AppConfig } from '@setl/utils/appConfig/appConfig.model';
import { Subscription } from 'rxjs/Subscription';
import { select } from '@angular-redux/store';
import { Router } from '@angular/router';
import { MyUserService } from '@setl/core-req-services/my-user/my-user.service';

@Component({
    styleUrls: ['./alerts.component.scss'],
    selector: 'alerts',
    templateUrl: './alerts.component.html',
})

export class AlertsComponent implements AfterViewInit, OnDestroy {

    public appConfig: AppConfig;
    public showAlert: boolean = false;
    public alerts = [];
    public menuShow: boolean = true;
    public totalAlerts: number = 0;
    public currentAlert: number = 0;
    public mainClass = [];
    public paddingClass = [];

    private subscriptions: Subscription[] = [];

    @select(['user', 'alerts', 'alerts']) getAlert$;
    @select(['user', 'siteSettings', 'menuShown']) menuShowOb;

    constructor(public changeDetectorRef: ChangeDetectorRef,
                private router: Router,
                private userService: MyUserService,
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
   
        /* Subscribe to the menu shown value in redux. */
        this.subscriptions.push(this.menuShowOb.subscribe(
            (menuState) => {
                this.menuShow = menuState;
                this.changeClasses();
            },
        ));
    }

    buttonClick(){
        if (this.alerts[this.currentAlert]['buttonPath'] === 'markAsRead'){
            this.userService.markAlertAsRead(this.alerts[this.currentAlert]['alertID']);
        }else{
            this.router.navigateByUrl(this.alerts[this.currentAlert]['buttonPath']);
        }
    }

    changeClasses(){
        this.mainClass = [];
        this.mainClass.push((this.menuShow ? 'menuShow' : 'menuHide'));
        if (this.alerts.length > 0){
            this.mainClass.push(this.alerts[this.currentAlert]['class']);
        }

        this.paddingClass = [];
        this.paddingClass.push((this.menuShow ? 'menuShowPadding' : 'menuHidePadding'));
    }

    changeAlert(dir){
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
