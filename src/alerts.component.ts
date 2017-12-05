import {
    Component,
    OnInit,
    ViewContainerRef,
    OnDestroy,
    Input,
    ReflectiveInjector,
    ComponentFactoryResolver,
    ComponentRef,
    ViewChild
} from '@angular/core';
import {Router} from '@angular/router';
import {AlertsService} from './alerts.service';
import {AlertSettings} from './interfaces/alert-settings';
import {AlertComponent} from './alert.component';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'jaspero-alerts',
    entryComponents: [AlertComponent],
    template: `
        <div #comp></div>`
})
export class AlertsComponent implements OnInit, OnDestroy {
    constructor(private _service: AlertsService,
                private _resolver: ComponentFactoryResolver,
                private _router: Router) {
    }

    @ViewChild('comp', {read: ViewContainerRef}) compViewContainerRef: ViewContainerRef;

    @Input() set defaultSettings(settings: AlertSettings) {
        this.settings = Object.assign({}, this.settings, settings);
    }

    settings: AlertSettings = {
        overlay: true,
        overlayClickToClose: true,
        showCloseButton: true,
        duration: 3000
    };

    private _current: ComponentRef<AlertComponent>;
    private _latestSub: any;
    private _listener: any;
    private _updateViewListener: any;
    private _routerOb: Subscription;

    ngOnInit() {

        this._listener = this._service.alert$.subscribe(alert => {
            if (this._current) {
                if (alert.close) setTimeout(() => this._destroy(), 450);
                else this._destroy();
            }

            if (alert.close) return;

            let settingsFinalAsArray = [];

            for (let key in this.settings) {
                let toUse = alert.override[key] !== undefined ? alert.override[key] : this.settings[key];
                settingsFinalAsArray.push({key: key, value: toUse});
            }

            let inputProviders = [
                    {key: 'message', value: alert.message},
                    {key: 'type', value: alert.type},
                    ...settingsFinalAsArray
                ].map((input) => {
                    return {provide: input.key, useValue: input.value};
                }),
                resolvedInputs = ReflectiveInjector.resolve(inputProviders),
                injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.compViewContainerRef.parentInjector),
                factory = this._resolver.resolveComponentFactory(AlertComponent),
                component = factory.create(injector);

            this.compViewContainerRef.insert(component.hostView);

            this._current = component;

            this._latestSub = component.instance.close.subscribe((res: any) => {
                this._service.alert$.next(res);

                this._routerOb.unsubscribe();
            });

            this._routerOb = this._router.events.subscribe((event) => {
                this._current.instance.closeSelf();
            });
        });

        this._updateViewListener = this._service.update$.subscribe((updateView) => {
            if (this._current) {
                this._current.instance.updateAlertType(updateView.type);
                this._current.instance.updateMessage(updateView.message);
            }
        });
    }


    private _destroy() {
        /*
         We run the check twice in case the component timed out
         This can happen on short durations
         */

        if (this._current) {
            this._current.destroy();
            this._current = null;
        }
        this._latestSub.unsubscribe();
    }

    ngOnDestroy() {
        this._listener.unsubscribe();
        this._updateViewListener.unsubscribe();
    }
}
