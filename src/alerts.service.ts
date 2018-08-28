import { Injectable } from '@angular/core';
import { AlertEmit, UpdateEmit } from './interfaces/alert-emit';
import { Subject } from 'rxjs';
import { AlertSettings } from './interfaces/alert-settings';
import { AlertType } from './interfaces/alert-type';

@Injectable()
export class AlertsService {
    alert$: Subject<AlertEmit> = new Subject();
    update$: Subject<UpdateEmit> = new Subject();

    create(type: AlertType, message: string, settingsOverrides: AlertSettings = {}, titleMessage: string | boolean = false): Subject<any> {
        const create$ = new Subject();
        this.alert$.next({ type: type, message: message, titleMessage, override: settingsOverrides });
        this.alert$.subscribe((d) => {
            if (d.close) {
                create$.next();
            }
        })
        return create$;
    }

    close() {
        this.alert$.next({ close: true });
    }

    updateView(type, message: string) {
        this.update$.next({ type, message });
    }
}
