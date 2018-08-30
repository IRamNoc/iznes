import {
    Component,
    OnInit,
    ViewContainerRef,
    OnDestroy,
    Input,
    ReflectiveInjector,
    ComponentFactoryResolver,
    ComponentRef,
    ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { AlertsService } from './alerts.service';
import { AlertSettings } from './interfaces/alert-settings';
import { AlertComponent } from './alert.component';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jaspero-alerts',
    entryComponents: [AlertComponent],
    template: `
        <div #comp></div>`,
})
export class AlertsComponent implements OnInit, OnDestroy {
    constructor(private service: AlertsService,
                private resolver: ComponentFactoryResolver,
                private router: Router) {
    }

    @ViewChild('comp', { read: ViewContainerRef }) compViewContainerRef: ViewContainerRef;

    @Input() set defaultSettings(settings: AlertSettings) {
        this.settings = Object.assign({}, this.settings, settings);
    }

    settings: AlertSettings = {
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        duration: 3000,
        buttonMessage: 'Close',
    };

    private current: ComponentRef<AlertComponent>;
    private latestSub: any;
    private listener: any;
    private updateViewListener: any;
    private routerOb: Subscription;

    ngOnInit() {

        this.listener = this.service.alert$.subscribe((alert) => {
            let prevType = null;

            if (this.current) {
                prevType = this.current.instance.type;
                if (alert.close) setTimeout(() => this.destroy(), 450);
                else this.destroy();
            }

            if (alert.close || alert.type === 'clear') return;

            const settingsFinalAsArray = [];

            for (const key in this.settings) {
                const toUse = alert.override[key] !== undefined ? alert.override[key] : this.settings[key];
                settingsFinalAsArray.push({ key, value: toUse });
            }

            const inputProviders = [
                { key: 'titleMessage', value: alert.titleMessage },
                { key: 'message', value: alert.message },
                { key: 'type', value: alert.type },
                { key: 'prevType', value: prevType },
                ...settingsFinalAsArray,
            ].map((input) => {
                return { provide: input.key, useValue: input.value };
            });
            const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
            const injector = ReflectiveInjector.fromResolvedProviders(
                resolvedInputs,
                this.compViewContainerRef.parentInjector,
            );
            const factory = this.resolver.resolveComponentFactory(AlertComponent);
            const component = factory.create(injector);

            this.compViewContainerRef.insert(component.hostView);

            this.current = component;

            this.latestSub = component.instance.close.subscribe((res: any) => {
                this.service.alert$.next(res);

                this.routerOb.unsubscribe();
            });

            this.routerOb = this.router.events.subscribe((event) => {
                if (this.current) this.current.instance.closeSelf();
            });
        });

        this.updateViewListener = this.service.update$.subscribe((updateView) => {
            if (this.current) {
                this.current.instance.updateAlertType(updateView.type);
                this.current.instance.updateMessage(updateView.message);
            }
        });
    }

    private destroy() {
        /*
         We run the check twice in case the component timed out
         This can happen on short durations
         */

        if (this.current) {
            this.current.destroy();
            this.current = null;
        }
        this.latestSub.unsubscribe();
        // this.listener.unsubscribe();
    }

    ngOnDestroy() {
        this.listener.unsubscribe();
        this.updateViewListener.unsubscribe();
    }
}
